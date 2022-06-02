import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Banner from '../components/Banner'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'

interface Props {
  posts: [Post]
}
export default function Home({ posts }: Props) {
  console.log(posts)
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Adenike Health Tips</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Banner />
      {/* Posts */}
      <div className="grid grid-cols-1 gap-3 p-2 md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:p-6">
        {posts.map((post) => (
          <Link key="post._id" href={`/post/${post.slug.current}`}>
            <div className="overflow-hidden border cursor-pointer rounded-xl group">
              {post.mainImage && (
                <img className="object-cover w-full transition-transform duration-200 ease-in-out h-80 group-hover:scale-105" src={urlFor(post.mainImage).url()} alt="post_image" />
              )}
              <div className="flex justify-between w-full h-full p-5 bg-pink-100">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="font-normal text-xm ">
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  className="w-12 h-12 rounded-full"
                  src={urlFor(post.author.image).url()!}
                  alt="author_image"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
//server prebuilts pages here
export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    author -> {
      name,
      image 
    },
    description,
    mainImage,
    slug
  } `;
  const posts = await sanityClient.fetch(query)
  return {
    props: {
      posts,
    },
  }
}
