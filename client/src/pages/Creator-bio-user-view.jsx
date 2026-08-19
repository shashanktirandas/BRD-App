import React, { useContext } from 'react'
import SearchNavbar from '../components/SearchNavbar';
import { Link, useParams } from 'react-router-dom';
import creator_photo from '../img/creator-photo.png'
import AppContext from '../context/AppContext';
import { getImageUrl } from '../utils/imageUrl';

const Creator_bio_user_view = () => {
    const {id}=useParams();
    const {creator}=useContext(AppContext);
    console.log("bio",creator);
    
  return (
    <div>
      <div className="w-full min-h-screen bg-white relative flex flex-col gap-5 pb-15">
        <SearchNavbar/>
        <div className="w-full  flex flex-col gap-3 items-center px-3 ">
                   <div className="w-full lg:w-150 flex flex-col gap-3">
        <div  className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-sm font-semibold text-gray-400">
                    <h1>
                      Bio
                    </h1>
                    <p className=''>
                      {creator.bio}
                       </p>
        </div>
        <div  className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-sm font-semibold text-gray-400 flex flex-col gap-3">
                    <h1>
                      Camera
                    </h1>
                    <div className="w-full flex gap-2 justify-start flex-nowrap">
                        <div className="w-25 h-full shrink-0">
                             <img className="w-full h-25 rounded-sm object-cover" src={getImageUrl(creator.cameraImage)}/>
                         </div> 
                        <div className=" h-full flex flex-col gap-1">
                          <h2 className='text-sm text-black font-bold'> {creator.cameraBrand}</h2>
                          <p className=''>
                                {creator.cameraBrand}
                                50.1 MP Full-Frame Stacked BSI CMOS (A1) or Global Shutter Sensor (A9 III).
                                Continuous burst shooting up to 30–120 frames per second with real-time AI Bird Eye-AF tracking.
                         </p>
                        </div>
                        
                    </div>
                    
        </div>
        <div  className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 pb-4 text-sm font-semibold text-gray-400 flex flex-col gap-3">
                    <h1>
                      Camera Gear
                    </h1>
                    <div className="w-full flex gap-2 justify-start flex-col">
                        <div className=" h-full flex flex-col ">
                          <h2 className='text-sm text-black font-bold'> Prime Choice</h2>
                          <p className=''>
                                {creator.mainLens}
                         </p>
                        </div>
                        <div className=" h-full flex flex-col ">
                          <h2 className='text-sm text-black font-bold'> Zoom Choice</h2>
                          <p className=''>
                                {creator.zoomLens}
                         </p>
                        </div>
                        
                    </div>
                    
        </div>
        <div  className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 pb-4 text-sm font-semibold text-gray-400 flex flex-col gap-3">
                    <h1>
                      Location
                    </h1>
                    <div className="w-full flex gap-2 justify-start flex-col">
                        <div className=" h-full flex flex-col ">
                          <h2 className='text-sm text-black font-bold'> Field Location</h2>
                          <div className='flex gap-1'>
                                <p>{creator.city}</p>
                                <p>{creator.state}</p>
                                <p>{creator.country}</p>
                         </div>
                        </div>
                        
                    </div>
                    
        </div>
        <div  className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 pb-4 text-sm font-semibold text-gray-400 flex flex-col gap-3">
                    <h1>
                      Specializations
                    </h1>
                    <div className="w-full flex gap-2 justify-start flex-col">
                      <div className="h-full flex flex-col">
                            <h2 className="text-sm text-black font-bold">🦅 Skills</h2>

                            <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1 pl-3">
                                {creator.specialization &&(
                                  creator.specialization.map((ele)=>{
                                    return <li>{ele}</li>
                                  }))
                                }
                            </ul>
                        </div>
                        <div className="h-full flex flex-col">
                            <h2 className="text-sm text-black font-bold">🦅 Birds of Prey</h2>

                            <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1 pl-3">
                                <li>Eagles</li>
                                <li>Hawks</li>
                                <li>Falcons</li>
                                <li>Kites</li>
                            </ul>
                        </div>
                        <div className="h-full flex flex-col">
                            <h2 className="text-sm text-black font-bold">🦆 Water Birds</h2>

                            <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1 pl-3">
                                <li>Herons</li>
                                <li>Egrets</li>
                                <li>Pelicans</li>
                            </ul>
                        </div>
                        <div className="h-full flex flex-col">
                            <h2 className="text-sm text-black font-bold">🐦 Songbirds</h2>

                            <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1 pl-3">
                                <li>Bulbuls</li>
                                <li>Robins</li>
                            </ul>
                        </div>
                    </div>
                    
        </div>

            </div>
        </div>      
      </div>
    </div>
  )
}

export default Creator_bio_user_view
