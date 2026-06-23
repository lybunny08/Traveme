import { Request, Response } from "express";
import prisma from "../db/prisma";
import { Prisma } from "@prisma/client";

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export const listPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      tag,
      page = "1",
      limit = "10",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const where: Prisma.BlogPostWhereInput = { is_published: true };

    if (tag) {
      where.tags = { has: tag as string };
    }

    const [data, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: [{ published_at: { sort: "desc", nulls: "last" } }, { created_at: "desc" }],
        skip: offset,
        take: limitNum,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          cover_image: true,
          tags: true,
          is_published: true,
          published_at: true,
          created_at: true,
          updated_at: true,
          author: {
            select: { id: true, name: true, avatar_url: true },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    const mapped = data.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      cover_image: p.cover_image,
      tags: p.tags,
      is_published: p.is_published,
      published_at: p.published_at,
      created_at: p.created_at,
      updated_at: p.updated_at,
      author_id: p.author.id,
      author_name: p.author.name,
      author_avatar: p.author.avatar_url,
    }));

    res.json({
      data: mapped,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error("listPosts error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, avatar_url: true },
        },
      },
    });

    if (!post || !post.is_published) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image,
      tags: post.tags,
      is_published: post.is_published,
      published_at: post.published_at,
      created_at: post.created_at,
      updated_at: post.updated_at,
      author_id: post.author.id,
      author_name: post.author.name,
      author_avatar: post.author.avatar_url,
    });
  } catch (err) {
    console.error("getPost error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, excerpt, content, cover_image, tags, is_published } = req.body;
    const authorId = req.user!.id;

    if (!title || !content) {
      res.status(400).json({ error: "Title and content are required" });
      return;
    }

    const slug = slugify(title);

    const existing = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
    if (existing) {
      res.status(400).json({ error: "A post with this title already exists" });
      return;
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        cover_image: cover_image || null,
        author_id: authorId,
        tags: tags || [],
        is_published: is_published || false,
        published_at: is_published ? new Date() : null,
      },
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("createPost error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, cover_image, tags, is_published } = req.body;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const data: Prisma.BlogPostUpdateInput = {};

    if (title !== undefined) {
      data.title = title;
      const newSlug = slugify(title);
      if (newSlug !== existing.slug) {
        data.slug = newSlug;
      }
    }
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (content !== undefined) data.content = content;
    if (cover_image !== undefined) data.cover_image = cover_image;
    if (tags !== undefined) data.tags = tags;
    if (is_published !== undefined) {
      data.is_published = is_published;
      if (is_published && !existing.is_published) {
        data.published_at = new Date();
      } else if (!is_published) {
        data.published_at = null;
      }
    }

    if (Object.keys(data).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const updated = await prisma.blogPost.update({ where: { id }, data });
    res.json(updated);
  } catch (err) {
    console.error("updatePost error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.blogPost.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    await prisma.blogPost.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error("deletePost error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
