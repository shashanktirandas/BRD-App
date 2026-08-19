import React from 'react'
import Card from './Card'
import EditCard from './EditCard'

const CreatorCards = (props) => {
  console.log(props);
  return (
    <div  className=" w-full min-h-50 mt-4 p-1 flex gap-3  flex-wrap  justify-center lg:justify-center">
                       {
                        props.list.map((ele,idx)=>{
                                  return <EditCard key={idx} ele={ele}  />
                        })
                       }
                       
                 </div>
  )
}

export default CreatorCards
