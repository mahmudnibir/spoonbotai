
import React, { useState, useEffect } from 'react';
import { HeartIcon } from './icons/HeartIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface BlogProps {
  onNavigateBack: () => void;
}

interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  imageUrl: string;
  content: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: 'ai-in-the-kitchen-beyond-recipes',
    title: 'AI in the Kitchen: Beyond Just Recipes',
    author: 'Alex Chen',
    date: 'August 5, 2024',
    summary: 'Generative AI is changing how we cook, offering personalized meal plans, wine pairings, and even plating suggestions. Explore the future of culinary arts.',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: [
      "The kitchen has always been a place of innovation, from the first clay pots to the modern microwave. Today, we stand on the precipice of another revolution, one powered by artificial intelligence. While apps like Spoonbot AI are fantastic at generating recipes from on-hand ingredients, the potential for AI in the culinary world is vastly broader.",
      "Imagine an AI that not only gives you a recipe but also acts as your personal sous-chef. It could analyze the freshness of your ingredients via your smart fridge's camera, suggest substitutions based on flavor profiles, and create a dynamic cooking schedule to ensure every component of your meal is ready at the same time. This isn't science fiction; it's the near future of home cooking.",
      "Furthermore, AI is democratizing gourmet food. By learning your taste preferences, it can generate unique flavor combinations you'd never think to try, suggest the perfect wine or craft beer pairing for your meal, and even provide instructions on how to plate your dish like a Michelin-star chef. The goal is not to replace the human touch but to augment it, making creative and delicious cooking accessible to everyone."
    ]
  },
  {
    id: 'the-zero-waste-kitchen-handbook',
    title: 'The Zero-Waste Kitchen Handbook',
    author: 'Maria Garcia',
    date: 'July 28, 2024',
    summary: 'Embrace sustainability with our comprehensive guide to a zero-waste kitchen. Learn to use every part of your ingredients, from root to stem.',
    imageUrl: 'https://images.pexels.com/photos/255501/pexels-photo-255501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: [
      "Food waste is a significant environmental issue, but tackling it can start right in our own kitchens. Adopting a zero-waste philosophy isn't about perfection; it's about making conscious choices to use what we have more effectively. It starts with smart shopping and storage but truly comes to life in our cooking habits.",
      "Think about the parts of vegetables you normally discard. Broccoli stems can be peeled and roasted or blitzed into a delicious soup. Carrot tops can be turned into a vibrant pesto. Even stale bread has a second life as croutons, breadcrumbs, or the star of a panzanella salad. Apps that generate recipes from ingredients are a powerful tool in this fight, helping you find uses for that last-half-of-an-onion or a handful of wilting spinach.",
      "Beyond using scraps, a zero-waste kitchen is about mindset. It's about preserving, pickling, and fermenting to extend the life of produce. It’s about understanding that every bit of food required resources to grow and transport, and honoring that by ensuring it nourishes us instead of ending up in a landfill."
    ]
  },
  {
    id: 'fermentation-101-getting-started-with-gut-health',
    title: 'Fermentation 101: A Beginner\'s Guide',
    author: 'Kenji Tanaka',
    date: 'July 20, 2024',
    summary: 'Unlock a world of flavor and gut-friendly probiotics. Our simple guide will get you started on your journey to making your own kimchi, sauerkraut, and kombucha.',
    imageUrl: 'https://images.pexels.com/photos/5951351/pexels-photo-5951351.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: [
      "Fermentation is an ancient technique of food preservation that is experiencing a massive resurgence, and for good reason. It not only creates complex, tangy, and deeply savory flavors but also populates food with beneficial probiotics that are essential for a healthy gut microbiome.",
      "Getting started is easier than you think. You don't need fancy equipment. For sauerkraut, all you need is cabbage, salt, and a jar. For kimchi, you add some spices like garlic, ginger, and Korean chili flakes. The process is magical: naturally occurring bacteria and yeasts convert sugars into lactic acid, which preserves the food and creates its signature tang.",
      "Start small. Pick one project, like a simple sauerkraut, and see it through. The satisfaction of cracking open a jar of your own funky, flavorful creation is immense. From there, a world of kombucha, kefir, and sourdough awaits. It's a hobby that rewards you with both delicious food and improved well-being."
    ]
  },
  {
    id: 'batch-cooking-basics-for-busy-people',
    title: 'Batch Cooking Basics for Busy People',
    author: 'Chef AI',
    date: 'July 12, 2024',
    summary: 'Reclaim your weeknights with the power of batch cooking. We break down how to prep a week of delicious, healthy meals in just a few hours.',
    imageUrl: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: [
        "The 5 PM scramble to figure out dinner is a universal stressor. Batch cooking is the antidote. The principle is simple: dedicate a couple of hours on the weekend to prepare core components that can be mixed and matched for quick, delicious meals throughout the week.",
        "Don't think of it as making five complete, separate meals. Instead, focus on versatile building blocks. For example, you could roast a large tray of mixed vegetables (broccoli, bell peppers, onions), cook a big pot of quinoa or brown rice, grill a batch of chicken breasts, and whip up a versatile vinaigrette. ",
        "With these components ready in your fridge, your weeknight 'cooking' becomes assembly. A quinoa bowl with roasted veggies and chicken? Two minutes. A quick chicken salad wrap? Done. A veggie omelet? Easy. This approach not only saves time but also reduces the temptation for less healthy takeout options, saving you money and helping you stick to your nutrition goals."
    ]
  },
];

interface LikeData {
  count: number;
  userLiked: boolean;
}

interface Comment {
  name: string;
  comment: string;
  date: string;
}

const Blog: React.FC<BlogProps> = ({ onNavigateBack }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // States for the detail view
  const [likes, setLikes] = useState<LikeData>({ count: 0, userLiked: false });
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: '', comment: '' });

  useEffect(() => {
    if (selectedPost) {
      // Load likes
      const likeData = JSON.parse(localStorage.getItem(`blog-likes-${selectedPost.id}`) || '{"count": 0, "userLiked": false}');
      setLikes(likeData);
      
      // Load comments
      const commentData = JSON.parse(localStorage.getItem(`blog-comments-${selectedPost.id}`) || '[]');
      setComments(commentData);

      window.scrollTo(0, 0);
    }
  }, [selectedPost]);

  const handleLike = () => {
    if (!selectedPost) return;
    const newLikes = {
      count: likes.userLiked ? likes.count - 1 : likes.count + 1,
      userLiked: !likes.userLiked,
    };
    setLikes(newLikes);
    localStorage.setItem(`blog-likes-${selectedPost.id}`, JSON.stringify(newLikes));
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newComment.name.trim() || !newComment.comment.trim()) return;

    const comment: Comment = {
      ...newComment,
      date: new Date().toLocaleDateString(),
    };
    
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`blog-comments-${selectedPost.id}`, JSON.stringify(updatedComments));
    setNewComment({ name: '', comment: '' });
  };
  
  const getInteractionCounts = (postId: string) => {
    const likeData: LikeData = JSON.parse(localStorage.getItem(`blog-likes-${postId}`) || '{"count": 0}');
    const commentData: Comment[] = JSON.parse(localStorage.getItem(`blog-comments-${postId}`) || '[]');
    return { likes: likeData.count, comments: commentData.length };
  };

  const renderBlogList = () => (
    <>
      <div className="flex justify-between items-center mb-8 border-b border-stone-200 pb-4">
        <h2 className="text-4xl font-bold text-emerald-800 font-serif">The Spoonbot AI Blog</h2>
        <button
          onClick={onNavigateBack}
          className="text-sm text-emerald-600 font-semibold hover:text-emerald-800 transition-colors"
        >
          &larr; Back to Generator
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => {
          const { likes, comments } = getInteractionCounts(post.id);
          return (
            <div 
              key={post.id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden group border border-stone-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer flex flex-col"
              onClick={() => setSelectedPost(post)}
            >
              <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-stone-800 font-serif mb-2">{post.title}</h3>
                <p className="text-sm text-stone-600 mb-4 flex-grow">{post.summary}</p>
                <div className="flex justify-between items-center text-xs text-stone-500 pt-4 border-t border-stone-100">
                  <span>By {post.author} &bull; {post.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><HeartIcon className="h-4 w-4 text-red-400" /> {likes}</span>
                    <span className="flex items-center gap-1"><MessageSquareIcon className="h-4 w-4 text-sky-500" /> {comments}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
  
  const renderPostDetail = () => {
    if (!selectedPost) return null;
    return (
      <div className="max-w-3xl mx-auto">
         <button
          onClick={() => setSelectedPost(null)}
          className="mb-6 bg-emerald-600 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-emerald-700 transition-all duration-300 flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Blog
        </button>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200">
          <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-64 object-cover" />
          <div className="p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 font-serif mb-3">{selectedPost.title}</h2>
            <p className="text-sm text-stone-500 mb-6">By {selectedPost.author} on {selectedPost.date}</p>
            <div className="prose max-w-none text-stone-700 space-y-4">
              {selectedPost.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>

            {/* Like Button */}
            <div className="mt-8 pt-6 border-t border-stone-200 flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 font-semibold py-2 px-4 rounded-full text-sm shadow-sm transition-all duration-300 transform hover:scale-105 ${
                  likes.userLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <HeartIcon className={`h-5 w-5 ${likes.userLiked ? 'fill-white' : 'fill-none'}`} />
                <span>{likes.userLiked ? 'Liked' : 'Like'} ({likes.count})</span>
              </button>
            </div>
            
            {/* Comments Section */}
            <div className="mt-8 pt-6 border-t border-stone-200">
              <h3 className="text-2xl font-bold text-stone-800 font-serif mb-4">Comments ({comments.length})</h3>
              <div className="space-y-4 mb-6">
                {comments.length > 0 ? comments.map((c, i) => (
                  <div key={i} className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                    <p className="font-semibold text-stone-800">{c.name}</p>
                    <p className="text-xs text-stone-500 mb-2">{c.date}</p>
                    <p className="text-stone-700">{c.comment}</p>
                  </div>
                )) : (
                  <p className="text-stone-500 italic">Be the first to comment!</p>
                )}
              </div>
              
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <h4 className="font-semibold text-stone-700">Leave a comment</h4>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newComment.name}
                  onChange={e => setNewComment({...newComment, name: e.target.value})}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all"
                  required
                />
                <textarea
                  placeholder="Your Comment"
                  value={newComment.comment}
                  onChange={e => setNewComment({...newComment, comment: e.target.value})}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all"
                  rows={3}
                  required
                />
                <button type="submit" className="bg-emerald-600 text-white font-semibold py-2 px-5 rounded-full text-sm shadow-sm hover:bg-emerald-700 transition-all">
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      {selectedPost ? renderPostDetail() : renderBlogList()}
    </div>
  );
};

export default Blog;
