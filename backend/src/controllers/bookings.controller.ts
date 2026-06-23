import { Request, Response } from "express";
import prisma from "../db/prisma";
import { BookingStatus, Prisma } from "@prisma/client";

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { destination_id, start_date, end_date, nb_travelers, notes } = req.body;
    const userId = req.user!.id;

    if (!destination_id || !start_date || !end_date || !nb_travelers) {
      res.status(400).json({ error: "destination_id, start_date, end_date, and nb_travelers are required" });
      return;
    }

    if (nb_travelers < 1) {
      res.status(400).json({ error: "Number of travelers must be at least 1" });
      return;
    }

    const destination = await prisma.destination.findUnique({
      where: { id: destination_id },
      select: { id: true, price_per_person: true, max_group_size: true, is_active: true },
    });

    if (!destination) {
      res.status(404).json({ error: "Destination not found" });
      return;
    }

    if (!destination.is_active) {
      res.status(400).json({ error: "This destination is no longer available" });
      return;
    }

    if (destination.max_group_size && nb_travelers > destination.max_group_size) {
      res.status(400).json({
        error: `Maximum group size is ${destination.max_group_size} travelers`,
      });
      return;
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (endDate <= startDate) {
      res.status(400).json({ error: "End date must be after start date" });
      return;
    }

    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const total_price = Number(destination.price_per_person) * nb_travelers * daysDiff;

    const booking = await prisma.booking.create({
      data: {
        user_id: userId,
        destination_id,
        start_date: startDate,
        end_date: endDate,
        nb_travelers: parseInt(nb_travelers, 10),
        total_price,
        notes: notes || null,
      },
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const bookings = await prisma.booking.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      include: {
        destination: {
          select: {
            name: true,
            slug: true,
            location: true,
            images: true,
            category: true,
          },
        },
      },
    });

    const mapped = bookings.map((b) => ({
      id: b.id,
      destination_id: b.destination_id,
      start_date: b.start_date,
      end_date: b.end_date,
      nb_travelers: b.nb_travelers,
      total_price: b.total_price,
      status: b.status,
      notes: b.notes,
      created_at: b.created_at,
      updated_at: b.updated_at,
      destination_name: b.destination.name,
      destination_slug: b.destination.slug,
      destination_location: b.destination.location,
      destination_images: b.destination.images,
      destination_category: b.destination.category,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("getMyBookings error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      status: statusFilter,
      destination_id,
      page = "1",
      limit = "20",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const where: Prisma.BookingWhereInput = {};

    if (statusFilter) {
      where.status = statusFilter as BookingStatus;
    }

    if (destination_id) {
      where.destination_id = destination_id as string;
    }

    const [data, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: offset,
        take: limitNum,
        include: {
          user: {
            select: { name: true, email: true, avatar_url: true },
          },
          destination: {
            select: { name: true, slug: true, location: true, images: true },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    const mapped = data.map((b) => ({
      id: b.id,
      user_id: b.user_id,
      destination_id: b.destination_id,
      start_date: b.start_date,
      end_date: b.end_date,
      nb_travelers: b.nb_travelers,
      total_price: b.total_price,
      status: b.status,
      notes: b.notes,
      created_at: b.created_at,
      updated_at: b.updated_at,
      user_name: b.user.name,
      user_email: b.user.email,
      user_avatar: b.user.avatar_url,
      destination_name: b.destination.name,
      destination_slug: b.destination.slug,
      destination_location: b.destination.location,
      destination_images: b.destination.images,
    }));

    res.json({
      data: mapped,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error("getAllBookings error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
      return;
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: status as BookingStatus },
    });

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json(booking);
  } catch (err) {
    console.error("updateBookingStatus error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
