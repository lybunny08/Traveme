import { Request, Response } from "express";
import prisma from "../db/prisma";
import { DestinationCategory, Prisma } from "@prisma/client";

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export const listDestinations = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      location,
      category,
      minPrice,
      maxPrice,
      is_featured,
      page = "1",
      limit = "12",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12));
    const offset = (pageNum - 1) * limitNum;

    const where: Prisma.DestinationWhereInput = { is_active: true };

    if (location) {
      where.location = { contains: location as string, mode: "insensitive" };
    }

    if (category) {
      where.category = category as DestinationCategory;
    }

    if (minPrice) {
      where.price_per_person = { ...(where.price_per_person as object || {}), gte: parseFloat(minPrice as string) };
    }

    if (maxPrice) {
      where.price_per_person = { ...(where.price_per_person as object || {}), lte: parseFloat(maxPrice as string) };
    }

    if (is_featured === "true") {
      where.is_featured = true;
    }

    const [data, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
        skip: offset,
        take: limitNum,
      }),
      prisma.destination.count({ where }),
    ]);

    res.json({
      data,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error("listDestinations error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const destination = await prisma.destination.findUnique({
      where: { slug },
    });

    if (!destination || !destination.is_active) {
      res.status(404).json({ error: "Destination not found" });
      return;
    }

    const reviews = await prisma.review.findMany({
      where: { destination_id: destination.id },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        rating: true,
        comment: true,
        created_at: true,
        user: {
          select: { id: true, name: true, avatar_url: true },
        },
      },
    });

    res.json({
      ...destination,
      reviews,
    });
  } catch (err) {
    console.error("getDestination error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      location,
      category,
      price_per_person,
      currency = "USD",
      duration_days,
      max_group_size,
      included_items,
      itinerary,
      images,
      is_featured,
    } = req.body;

    if (!name || !location || !price_per_person || !duration_days) {
      res.status(400).json({ error: "Name, location, price_per_person, and duration_days are required" });
      return;
    }

    const slug = slugify(name);

    const existing = await prisma.destination.findUnique({ where: { slug }, select: { id: true } });
    if (existing) {
      res.status(400).json({ error: "A destination with this name already exists" });
      return;
    }

    const destination = await prisma.destination.create({
      data: {
        name,
        slug,
        description: description || null,
        location,
        category: (category || "city") as DestinationCategory,
        price_per_person,
        currency,
        duration_days: parseInt(duration_days, 10),
        max_group_size: max_group_size ? parseInt(max_group_size, 10) : 20,
        included_items: included_items || [],
        itinerary: itinerary || undefined,
        images: images || [],
        is_featured: is_featured || false,
      },
    });

    res.status(201).json(destination);
  } catch (err) {
    console.error("createDestination error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      location,
      category,
      price_per_person,
      currency,
      duration_days,
      max_group_size,
      included_items,
      itinerary,
      images,
      is_featured,
      is_active,
    } = req.body;

    const existing = await prisma.destination.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Destination not found" });
      return;
    }

    const data: Prisma.DestinationUpdateInput = {};

    if (name !== undefined) {
      data.name = name;
      data.slug = slugify(name);
    }
    if (description !== undefined) data.description = description;
    if (location !== undefined) data.location = location;
    if (category !== undefined) data.category = category as DestinationCategory;
    if (price_per_person !== undefined) data.price_per_person = price_per_person;
    if (currency !== undefined) data.currency = currency;
    if (duration_days !== undefined) data.duration_days = parseInt(duration_days, 10);
    if (max_group_size !== undefined) data.max_group_size = parseInt(max_group_size, 10);
    if (included_items !== undefined) data.included_items = included_items;
    if (itinerary !== undefined) data.itinerary = itinerary;
    if (images !== undefined) data.images = images;
    if (is_featured !== undefined) data.is_featured = is_featured;
    if (is_active !== undefined) data.is_active = is_active;

    if (Object.keys(data).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const updated = await prisma.destination.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (err) {
    console.error("updateDestination error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.destination.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      res.status(404).json({ error: "Destination not found" });
      return;
    }

    await prisma.destination.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error("deleteDestination error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
