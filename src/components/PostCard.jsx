import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className='group relative w-full border-2 border-refaa-blue hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[350px] transition-all shadow-xl mb-10 md:mb-0 z-0'>
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt='post cover'
          className='h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-0'
        />
      </Link>
      <div className='flex flex-col gap-2 p-3'>
        <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
        <span className='text-sm italic'>{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className='z-0 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-refaa-blue text-refaa-blue hover:bg-refaa-blue hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Read Article
        </Link>
      </div>
    </div>
  );
}