import { GetStaticProps } from "next";
import Header from "../../components/Header";
import {sanityClient, urlFor} from "../../sanity"
import { Post } from "../../typings";
import PortableText from "react-portable-text"

interface Props{
    post: Post;
}
function Post({post}: Props) {
    console.log(post)
  return (
    <main>
        <Header/>
        <img className="object-cover w-full h-60" src={urlFor(post.mainImage).url()!} alt="" />
        <article className="max-w-3xl p-5 mx-auto ">
            <h1 className="mt-10 mb-3 text-3xl ">{post.title}</h1>
            <h1 className="mb-3 text-xl font-light text-gray-500">{post.description}</h1>
            <div className="flex items-center space-x-5">
                <img className="w-12 h-12 rounded-full" src={urlFor(post.author.image).url()!} alt="" />
                <p className="font-serif text-sm font-extralight">
                    Blog by <span className="text-purple-600">{post.author.name}</span>  {" "} Published at {" "}
                    {
                        new Date(post._createdAt).toLocaleDateString()
                    }
                    </p>
            </div>

            <div>
                <PortableText className="mx-3 my-5 text-justify" 
                dataset={ process.env.NEXT_PUBLIC_SANITY_DATASET!}
                projectId= {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                content={post.body}
                serializers={{
                  h1: (props: any) => {
                      <h1 className="mx-3 my-5 text-3xl font-bold text-purple-900" {...props}/>
                  },
                  h2: (props: any) => {
                      <h2 className="mx-2 my-3 text-2xl font-normal text-purple-500" {...props}/>
                  },
                  li: (props: any) => {
                        <li className="mx-2 my-3 text-lg font-normal text-purple-500" {...props}></li>
                  },
                  link: ({href, children}: any) => {
                        <a href={href} className="mx-1 my-2 text-blue-200 hover:text-blue-600" >{children}</a>
                  },
                }}
                />
            </div>
        </article>
        <hr className="max-w-lg mx-auto border border-pink-500"/>
        <form className="flex flex-col max-w-2xl p-5 mx-auto mb-10">
            <h1 className="text-3xl text-center text-purple-600 mb-7">Leave a Comment Below, It tells me I am doing something good</h1>
            <label className="block mb-5">
                <span className="text-gray-500" >Name</span>
                <input className="block w-full px-3 py-2 mt-1 border rounded shadow outline-none form-input ring ring-pink-100 focus:ring" type="text" />
            </label>
            <label className="block mb-5">
                <span className="text-gray-500">Email</span>
                <input className="block w-full px-3 py-2 mt-1 border rounded shadow outline-none form-input ring-pink-300 focus:ring" type="text" />
            </label>
            <label className="block mb-5">
                <span className="text-gray-500">Comment</span>
                <textarea className="w-full px-3 py-2 mt-3 border rounded shadow outline-none form-texture bloc ring-pink-300 focus:ring" placeholder="Write your comment here" rows={8} />
            </label>
                
                
                
        </form>
       
    </main>
  );
}

export default Post; 

export const getStaticPaths = async ()=>{
const query = `*[_type == "post"]{
    _id,
    slug{
        current
    }
}`;

const posts = await sanityClient.fetch(query);

const paths = posts.map((post: Post) =>({
    params:{
        slug: post.slug.current
    }
}));

return {
    paths,
    fallback:'blocking',
};
};

export const getStaticProps: GetStaticProps = async ({params})=>{
    const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author -> {
            name,
            image
        },
        'comments': *[
            _type=="comment" &&
            post._ref == ^._id &&
            approved == true],
        description,
        mainImage,
        slug,
        body
    }`;
    const post = await sanityClient.fetch(query, { 
        slug: params?.slug,
    });
    if(!post){
        return {
            notFound: true
        }
    }
    return {
        props:{
            post,
    },
    revalidate: 3600
};
};
