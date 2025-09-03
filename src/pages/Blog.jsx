// src/pages/BlogPage.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Revival of Bengali Literature",
      excerpt: "Bengali literature has a deep-rooted history. Let's explore how modern readers are rediscovering timeless classics.",
      author: "Biswa Bangiya Prakashan",
      date: "Aug 25, 2025",
    },
    {
      id: 2,
      title: "Top 5 Must-Read Bangladeshi Authors",
      excerpt: "Bangladeshi authors have shaped modern literature. Here are five you should not miss.",
      author: "Biswa Bangiya Prakashan",
      date: "Sep 2, 2025",
    },
    {
      id: 3,
      title: "How to Build Your Home Library",
      excerpt: "Collecting books is more than a hobby, it’s a lifestyle. Here’s a guide to start your own library.",
      author: "Biswa Bangiya Prakashan",
      date: "Sep 3, 2025",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-xl">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <p className="text-sm text-gray-500">
                By {post.author} • {post.date}
              </p>
              <Button
                variant="link"
                className="mt-2 p-0"
                onClick={() => alert(`Open blog: ${post.title}`)}
              >
                Read More →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
