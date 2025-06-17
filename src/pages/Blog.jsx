
import { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import { blog_data,comments_data } from '../assets/assets'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Moment from 'moment'
import { useAppContext } from '../context/AppContext'
const Blog = () => {
const {id} = useParams()
 const  [data , setData] = useState(null)
 const [comments , setComments] = useState([])
const {axios, toast} = useAppContext();
 const [name, setName] = useState('')
 const [content, setContent] = useState('')

const fetchComments = async () => {
  try {
    const { data } = await axios.get(`/api/blog/comments/${id}`);
    if (data.success) {
      setComments(data.comments);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};



const fetchBlogData = async ()=>{
 try {
  const {data} = await axios.get(`/api/blog/${id}`)
  data.success ? setData(data.blog) : toast.error(data.message)
 } catch (error) {
  toast.error(error.message)
 }
}

const addComment = async (e) => {
  e.preventDefault(); // prevent reload
  try {
    const { data } = await axios.post('/api/blog/add-comment', { blogId: id, name, content });
    if (data.success) {
      toast.success(data.message);
      setName('');
      setContent('');
      fetchComments(); // refresh comment list
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


useEffect(()=>{
   fetchBlogData();
   fetchComments();
},[])

  return data? (
    <div className='relative'>
      <img className='absolute -top-50 -z-1 opacity-50' src={assets.gradientBackground} alt="" />
       <Navbar/>

      <div className='text-center mt-20 text-gray-600'>
        <p className='text-primary py-4 font-medium'>Published on {Moment(data.createdAt).format('MMM Do YYYY')}</p>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>{data.title}</h1>
        <h2 className='my-5 max-w-lg truncate mx-auto'>{data.subtitle}</h2>
        <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primay'>Michael Brown</p>
      </div>

      <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
          <img className='rounded-3xl mb-5' src={data.image} alt="" />       
          <div className='rich-text max-w-3xl mx-auto' dangerouslySetInnerHTML={{__html: data.description}}>
          
       </div>

        <div className='mt-14 mb-10 max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>Comments ({comments.length})</p>
          <div className='flex flex-col gap-4'>
             {comments.map((item, index)=>(
              <div className='relative bg-primary/2 border border-primary/5 max-w-xl rounded text-gray-600' key={index}>
                  <div className='flex items-center gap-2 mb-2 mt-2 ml-2'>
                    <img src={assets.user_icon} className='w-6' alt="" />
                    <p className='font-medium'>{item.name}</p>
                  </div>
                  <p className='text-sm max-w-md ml-8 mb-2'>{item.content}</p>
                  <div className='absolute right-4 bottom-3 flex items-center gap-2 text-xs'> {Moment(item.createdAt).fromNow()} </div>
              </div>
             ))}
          </div>

        </div>
        <div className='max-w-3xl mx-auto'>

          <p className='font-semibold mb-4'>
           Add your comment
          </p>
          <form onSubmit={addComment} className='flex flex-col items-start gap-4 max-w-lg'>
            <input onChange={(e)=> setName(e.target.value)} value={name} className='w-full p-2 border border-gray-300 rounded outline-none' type="text" placeholder='Name'  required/>

            <textarea onChange={(e)=> setContent(e.target.value)} value={content}  className='w-full p-2 border border-gray-300 rounded ouline-none h-48' required placeholder='comment'></textarea>

            <button className='bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer' type='submit'>Submit</button>
          </form>
        </div>
        <div className='my-24 max-w-3xl mx-auto'>
          <p className='font-semibold my-4'>Share this article on social media</p>
          <div className='flex'>
             <img src={assets.facebook_icon} width={50} alt="" />
                          <img src={assets.twitter_icon} width={50} alt="" />
                                       <img src={assets.googleplus_icon} width={50} alt="" />
          </div>
        </div>                              
      </div>
       <Footer/>



    </div>
  ) : <div>loading...</div>
}

export default Blog
