import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@traveme.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@traveme.com",
      password_hash: passwordHash,
      role: "admin",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "user@example.com",
      password_hash: passwordHash,
      role: "user",
    },
  });

  console.log("Users created:", admin.email, user.email);

  const destinations = [
    {
      name: "Santorini Paradise",
      slug: "santorini-paradise",
      description: "Experience the breathtaking beauty of Santorini with its white-washed buildings, stunning sunsets, and crystal-clear waters of the Aegean Sea.",
      location: "Santorini, Greece",
      category: "beach" as const,
      price_per_person: 1299,
      currency: "USD",
      duration_days: 7,
      max_group_size: 15,
      included_items: ["Accommodation", "Breakfast", "Airport transfer", "Guided tour"],
      itinerary: { day1: "Arrival & welcome", day2: "Oia sunset tour", day3: "Beach day", day4: "Wine tasting", day5: "Boat cruise", day6: "Free day", day7: "Departure" },
      images: ["https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800"],
      is_featured: true,
      avg_rating: 4.8,
      review_count: 24,
    },
    {
      name: "Swiss Alps Adventure",
      slug: "swiss-alps-adventure",
      description: "Conquer the majestic Swiss Alps with guided hiking trails, cable car rides, and cozy mountain lodge accommodations.",
      location: "Interlaken, Switzerland",
      category: "mountain" as const,
      price_per_person: 2199,
      currency: "USD",
      duration_days: 10,
      max_group_size: 12,
      included_items: ["Mountain lodge", "All meals", "Hiking gear", "Cable car passes"],
      itinerary: { day1: "Arrival in Interlaken", day2: "Jungfraujoch excursion", day3: "Hiking trail", day4: "Paragliding", day5: "Lake cruise", day6: "Free hiking", day7: "Grindelwald", day8: "Rest day", day9: "Farewell dinner", day10: "Departure" },
      images: ["https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800"],
      is_featured: true,
      avg_rating: 4.9,
      review_count: 31,
    },
    {
      name: "Tokyo City Lights",
      slug: "tokyo-city-lights",
      description: "Immerse yourself in the vibrant culture of Tokyo, from ancient temples to neon-lit skyscrapers and world-class cuisine.",
      location: "Tokyo, Japan",
      category: "city" as const,
      price_per_person: 1899,
      currency: "USD",
      duration_days: 8,
      max_group_size: 20,
      included_items: ["Hotel", "Breakfast", "Metro pass", "Guide"],
      itinerary: { day1: "Arrival", day2: "Shibuya & Shinjuku", day3: "Asakusa & Akihabara", day4: "Mount Fuji day trip", day5: "Tsukiji market", day6: "Harajuku & Shibuya", day7: "Free day", day8: "Departure" },
      images: ["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800"],
      is_featured: true,
      avg_rating: 4.7,
      review_count: 18,
    },
    {
      name: "Maasai Mara Safari",
      slug: "maasai-mara-safari",
      description: "Witness the Great Migration and the Big Five on an unforgettable safari adventure in Kenya's most famous reserve.",
      location: "Maasai Mara, Kenya",
      category: "wildlife" as const,
      price_per_person: 3499,
      currency: "USD",
      duration_days: 7,
      max_group_size: 8,
      included_items: ["Luxury tent", "All meals", "Game drives", "Park fees"],
      itinerary: { day1: "Arrival", day2: "Full day game drive", day3: "Maasai village visit", day4: "Bush walk", day5: "Balloon safari", day6: "Final game drive", day7: "Departure" },
      images: ["https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800"],
      is_featured: false,
      avg_rating: 5.0,
      review_count: 12,
    },
    {
      name: "Parisian Romance",
      slug: "parisian-romance",
      description: "Fall in love with the City of Light on a romantic getaway featuring the Eiffel Tower, Seine river cruises, and gourmet dining.",
      location: "Paris, France",
      category: "romantic" as const,
      price_per_person: 1599,
      currency: "USD",
      duration_days: 5,
      max_group_size: 2,
      included_items: ["Boutique hotel", "Breakfast", "Seine cruise", "Eiffel Tower access"],
      itinerary: { day1: "Arrival & Seine cruise", day2: "Louvre & Notre-Dame", day3: "Montmartre & Sacré-Coeur", day4: "Versailles day trip", day5: "Departure" },
      images: ["https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800"],
      is_featured: true,
      avg_rating: 4.6,
      review_count: 42,
    },
    {
      name: "Bali Wellness Retreat",
      slug: "bali-wellness-retreat",
      description: "Rejuvenate your mind and body in Bali's lush tropical paradise with yoga sessions, spa treatments, and organic cuisine.",
      location: "Ubud, Bali, Indonesia",
      category: "cultural" as const,
      price_per_person: 999,
      currency: "USD",
      duration_days: 6,
      max_group_size: 10,
      included_items: ["Villa", "Yoga classes", "Spa treatment", "All meals"],
      itinerary: { day1: "Welcome & orientation", day2: "Yoga & rice terraces", day3: "Temple tour", day4: "Cooking class", day5: "Beach day", day6: "Departure" },
      images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800"],
      is_featured: false,
      avg_rating: 4.5,
      review_count: 9,
    },
    {
      name: "Dubai Luxury Escape",
      slug: "dubai-luxury-escape",
      description: "Experience ultimate luxury in Dubai with skyscraper views, desert safaris, world-class shopping, and fine dining.",
      location: "Dubai, UAE",
      category: "city" as const,
      price_per_person: 2799,
      currency: "USD",
      duration_days: 5,
      max_group_size: 10,
      included_items: ["5-star hotel", "Breakfast", "Desert safari", "Burj Khalifa access"],
      itinerary: { day1: "Arrival & city tour", day2: "Desert safari", day3: "Dubai Mall & fountain", day4: "Abu Dhabi day trip", day5: "Departure" },
      images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800"],
      is_featured: false,
      avg_rating: 4.4,
      review_count: 15,
    },
    {
      name: "Great Barrier Reef Dive",
      slug: "great-barrier-reef-dive",
      description: "Explore the world's largest coral reef system with expert dive instructors and luxury liveaboard accommodation.",
      location: "Cairns, Australia",
      category: "adventure" as const,
      price_per_person: 2499,
      currency: "USD",
      duration_days: 8,
      max_group_size: 12,
      included_items: ["Liveaboard", "All meals", "Dive equipment", "Certification"],
      itinerary: { day1: "Arrival & gear check", day2: "Outer reef dive", day3: "Snorkeling", day4: "Deep dive", day5: "Island visit", day6: "Night dive", day7: "Final dives", day8: "Departure" },
      images: ["https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?w=800"],
      is_featured: false,
      avg_rating: 4.8,
      review_count: 7,
    },
  ];

  for (const dest of destinations) {
    const { avg_rating, review_count, ...destData } = dest;
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: {},
      create: destData,
    });
  }

  console.log("Destinations created:", destinations.length);

  const blogPosts = [
    {
      title: "Top 10 Travel Destinations for 2025",
      slug: "top-10-travel-destinations-2025",
      excerpt: "Discover the hottest travel destinations that should be on your bucket list this year.",
      content: "From the sun-soaked beaches of Santorini to the vibrant streets of Tokyo, 2025 is shaping up to be an incredible year for travel. Here are our top 10 picks that offer unique experiences, stunning landscapes, and unforgettable memories.\n\n1. **Santorini, Greece** - Famous for its iconic blue-domed churches and breathtaking sunsets.\n2. **Tokyo, Japan** - A perfect blend of ancient traditions and futuristic innovation.\n3. **Maasai Mara, Kenya** - Witness the Great Migration in all its glory.\n4. **Bali, Indonesia** - Find your inner peace in this tropical paradise.\n5. **Paris, France** - The eternal city of love and lights.\n6. **Swiss Alps** - Adventure awaits in the heart of Europe.\n7. **Dubai, UAE** - Experience luxury like never before.\n8. **Great Barrier Reef, Australia** - Dive into an underwater wonderland.\n9. **Machu Picchu, Peru** - Walk the path of the Incas.\n10. **Northern Lights, Iceland** - Witness nature's most spectacular light show.\n\nEach destination offers something unique, whether you're seeking adventure, relaxation, or cultural immersion. Start planning your 2025 adventure today with TraveMe!",
      cover_image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
      tags: ["travel", "destinations", "2025", "bucket-list"],
      is_published: true,
      published_at: new Date("2025-01-15"),
    },
    {
      title: "Essential Travel Tips for First-Time Flyers",
      slug: "essential-travel-tips-first-time-flyers",
      excerpt: "Everything you need to know before your first flight — from packing to boarding.",
      content: "Flying for the first time can be both exciting and nerve-wracking. Don't worry — we've got you covered with these essential tips!\n\n## Before You Fly\n- Check your passport validity (at least 6 months)\n- Pack liquids in containers of 100ml or less\n- Arrive at the airport at least 3 hours before international flights\n\n## At the Airport\n- Keep your documents accessible\n- Follow baggage allowance rules\n- Stay hydrated\n\n## On the Plane\n- Wear comfortable clothing\n- Move around periodically\n- Chew gum or yawn to help with ear pressure\n\nRemember, every frequent flyer was once a first-timer. Enjoy the journey!",
      cover_image: "https://images.unsplash.com/photo-1436491865332-7a61a109edb8?w=800",
      tags: ["travel-tips", "flying", "beginners"],
      is_published: true,
      published_at: new Date("2025-02-20"),
    },
    {
      title: "A Food Lover's Guide to Tokyo",
      slug: "food-lovers-guide-tokyo",
      excerpt: "Explore Tokyo's incredible food scene from Michelin-starred restaurants to hidden local gems.",
      content: "Tokyo is a paradise for food lovers, boasting more Michelin-starred restaurants than any other city in the world. But beyond the fine dining scene, the city offers an incredible range of culinary experiences.\n\n## Must-Try Dishes\n- **Sushi** - Visit Tsukiji Outer Market for the freshest sushi\n- **Ramen** - Each neighborhood has its own specialty broth\n- **Okonomiyaki** - A savory pancake you cook at your table\n- **Takoyaki** - Octopus balls, a perfect street food snack\n- **Matcha desserts** - From ice cream to tiramisu\n\n## Best Food Districts\n- Shinjuku: Late-night izakayas\n- Ginza: High-end dining\n- Asakusa: Traditional Japanese sweets\n- Shibuya: Trendy cafes and fusion food\n\nPro tip: Many restaurants have English menus, but learning a few Japanese phrases will enhance your experience!",
      cover_image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
      tags: ["food", "tokyo", "japan", "travel-guide"],
      is_published: true,
      published_at: new Date("2025-03-10"),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        author_id: admin.id,
      },
    });
  }

  console.log("Blog posts created:", blogPosts.length);

  const allDestinations = await prisma.destination.findMany({ select: { id: true, name: true } });
  const santorini = allDestinations.find((d) => d.name === "Santorini Paradise");
  const tokyo = allDestinations.find((d) => d.name === "Tokyo City Lights");

  if (santorini && tokyo) {
    const review1 = await prisma.review.upsert({
      where: { user_id_destination_id: { user_id: user.id, destination_id: santorini.id } },
      update: {},
      create: {
        user_id: user.id,
        destination_id: santorini.id,
        rating: 5,
        comment: "Absolutely breathtaking! The sunset in Oia was the most beautiful thing I've ever seen. The guided tour was excellent and the accommodation was perfect.",
      },
    });

    const review2 = await prisma.review.upsert({
      where: { user_id_destination_id: { user_id: user.id, destination_id: tokyo.id } },
      update: {},
      create: {
        user_id: user.id,
        destination_id: tokyo.id,
        rating: 4,
        comment: "Tokyo is an incredible city. The metro pass made getting around super easy. Would have loved an extra day for exploring.",
      },
    });

    // Update avg_rating and review_count
    for (const destId of [santorini.id, tokyo.id]) {
      const agg = await prisma.review.aggregate({
        where: { destination_id: destId },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await prisma.destination.update({
        where: { id: destId },
        data: {
          avg_rating: agg._avg.rating ?? 0,
          review_count: agg._count.rating,
        },
      });
    }

    console.log("Reviews created for:", santorini.name, tokyo.name);
  }

  if (santorini) {
    const startDate = new Date("2025-08-15");
    const endDate = new Date("2025-08-22");

    await prisma.booking.upsert({
      where: { id: "00000000-0000-0000-0000-000000000001" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000001",
        user_id: user.id,
        destination_id: santorini.id,
        start_date: startDate,
        end_date: endDate,
        nb_travelers: 2,
        total_price: 1299 * 2 * 7,
        status: "confirmed",
        notes: "Honeymoon trip. Request a room with sea view.",
      },
    });

    console.log("Sample booking created");
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
