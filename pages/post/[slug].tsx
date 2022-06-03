import { GetStaticProps } from "next";
import Header from "../../components/Header";
import {sanityClient, urlFor} from "../../sanity"
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import {useForm, SubmitHandler} from "react-hook-form";
import { useState } from "react";
interface iFormInput{
    _id: string,
    name: string, 
    email: string,
    comment: string
}

interface Props{
    post: Post;
}
function Post({post}: Props) {
    console.log(post)
const [submitted, setSubmitted] = useState(false)
    const {register, handleSubmit, formState: {errors}} = useForm<iFormInput>();

    const onSubmit: SubmitHandler<iFormInput> = async  (data) => {
       await fetch("/api/createComment", {
              method: 'POST',
              body: JSON.stringify(data),
       }).then(()=> {
           console.log(data)
           setSubmitted(true)
       }).catch(err => {
              console.log(err)
              setSubmitted(false)
       })
    }
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
        <h1 className="max-w-2xl mx-auto mt-4 mb-4 text-3xl text-center text-purple-600">Leave a Comment Below, It tells me I am doing something good</h1>
            <hr className="max-w-lg mx-auto border border-pink-500"/>

            {
                submitted ? <div className="max-w-2xl px-5 py-5 mx-auto mb-4 text-3xl text-center text-green-500 bg-green-100 mt-7 rounded-2xl">
                    <h1>Thanks for your comment,  if approved you will see it soon.</h1></div> :(
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-w-2xl p-5 mx-auto mb-10">
            
                <input
                {...register("_id")}
                type="hidden"
                name="_id"
                value={post._id}   
                />
            <label className="block mb-5">
                <span className="text-gray-500" >Name</span>
                <input 
                {...register("name",{required: true})}
                className="block w-full px-3 py-2 mt-1 border rounded shadow outline-none form-input ring ring-pink-100 focus:ring" type="text" />
            </label>
            <label className="block mb-5">
                <span className="text-gray-500">Email</span>
                <input
                {...register("email", {required: true})} 
                className="block w-full px-3 py-2 mt-1 border rounded shadow outline-none form-input ring-pink-300 focus:ring" type="email" />
            </label>
            <label className="block mb-5">
                <span className="text-gray-500">Comment</span>
                <textarea 
                {...register("comment", {required: true})}
                className="w-full px-3 py-2 mt-3 border rounded shadow outline-none form-texture bloc ring-pink-300 focus:ring" placeholder="Write your comment here" rows={8} />
            </label>
                
                {/* error handling */}
            <div className="flex flex-col p-5">
                { errors.name && (<p className="text-red-500">
                    Enter a valid name, please!</p>)}
                {errors.email && (<p className="text-red-500">
                    Enter a valid email, please!</p>)}
                {errors.comment && (<p className="text-red-500">Enter a comment please</p>)}
                </div>     

                <input type="submit" className="px-4 py-2 font-bold text-pink-100 bg-purple-900 rounded shadow outline-none cursor-pointer focus:shadow-outline focus:outline-none hover:bg-purple-400"/>           
        </form>
                )
            }
            <div className="flex flex-col max-w-3xl p-10 mx-auto my-10 space-y-2 shadow shadow-purple-200 ">
                <h3 className="text-4xl">Comments</h3>
              <hr className="border border-pink-900 mb-15"/>
            {/* comments section */}
            {
                post.comments.map((comment) => (
                    <div key={comment._id}>
                        <p>
                            <span className="text-purple-500">{comment.name}</span>:  <span>{comment.comment}</span>
                        </p>
                    </div>
                ))
            }
            </div>
        
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
