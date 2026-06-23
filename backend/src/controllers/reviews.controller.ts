import { Request, Response } from "express";
import prisma from "../db/prisma";

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { destination_id, rating, comment } = req.body;
    const userId = req.user!.id;

    if (!destination_id || !rating) {
      res.status(400).json({ error: "destination_id and rating are required" });
      return;
    }

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      res.status(400).json({ error: "Rating must be between 1 and 5" });
      return;
    }

    const destination = await prisma.destination.findUnique({
      where: { id: destination_id },
      select: { id: true, is_active: true },
    });

    if (!destination || !destination.is_active) {
      res.status(404).json({ error: "Destination not found" });
      return;
    }

    const existingReview = await prisma.review.findUnique({
      where: { user_id_destination_id: { user_id: userId, destination_id } },
      select: { id: true },
    });

    if (existingReview) {
      res.status(400).json({ error: "You have already reviewed this destination" });
      return;
    }

    const review = await prisma.review.create({
      data: {
        user_id: userId,
        destination_id,
        rating: ratingNum,
        comment: comment || null,
      },
    });

    // Update destination avg_rating and review_count
    const agg = await prisma.review.aggregate({
      where: { destination_id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.destination.update({
      where: { id: destination_id },
      data: {
        avg_rating: agg._avg.rating ?? 0,
        review_count: agg._count.rating,
      },
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("createReview error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getDestinationReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const destination = await prisma.destination.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!destination) {
      res.status(404).json({ error: "Destination not found" });
      return;
    }

    const reviews = await prisma.review.findMany({
      where: { destination_id: id },
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

    res.json(reviews);
  } catch (err) {
    console.error("getDestinationReviews error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
