// import React, { useContext, useEffect, useState } from 'react'
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import AppContext from '../context/AppContext';
// import ProfileNavbar from '../components/ProfileNavbar';
// import { MdAutoGraph, MdOutlineUpdate } from 'react-icons/md';
// import ConfirmModal from '../components/ConfirmModal';
// import { FiEdit } from 'react-icons/fi';
// import { creator_info, creator_update } from '../services/creatorService';
// import OtpModal from '../components/OtpModal';
// import { getImageUrl } from '../utils/imageUrl';
// import cameras from "../data/cameras";
// import {
//     getCountries,
//     getStates,
//     getCities
// } from "../services/locationService";
// const Edit_creator = () => {
//   const navigate=useNavigate();
//   const {id}=useParams();
//   const {posts,setPosts,menu,setMenu,creator,setCreator,token}=useContext(AppContext);
//   const fetchProfile = async () => {
//             try {                
//                     const creatorResponse = await creator_info();    
//                     setCreator(creatorResponse.data.data.creator);
                    
//             } catch (err) {
//                 console.log(err);
//             }
//         };
        

//   //console.log(creator);
  
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const [camera, setCamera] = useState("");
//   const [cameraModel, setCameraModel] = useState("");
//   const [country, setCountry] = useState("");
//   const [state, setState] = useState("");
//   const [city, setCity] = useState("");
//   const [experience, setExperience] = useState("");
//   const [mainLens, setMainLens] = useState("");
//   const [zoomLens, setZoomLens] = useState("");
//   const [instagram, setInstagram] = useState("");
//   const [website, setWebsite] = useState("");
//   const [youtube, setYoutube] = useState("");

//   const [open, setOpen] = useState(false);
//   const [openOtp, setOpenOtp] = useState(false)
    
//   const [profileImage, setProfileImage] = useState(null);
//   const [coverImage, setCoverImage] = useState(null);
//   const [cameraImage, setCameraImage] = useState(null);

//   const [profilePreview, setProfilePreview] = useState("");
//   const [coverPreview, setCoverPreview] = useState("");
//   const [cameraPreview, setCameraPreview] = useState("");

//   const [specializations, setSpecializations] = useState([]);
//   const [specializationInput, setSpecializationInput] = useState("");

//   const [countries, setCountries] = useState([]);
//       const [states, setStates] = useState([]);
//       const [cities, setCities] = useState([]);
  
//       const [loadingCountries, setLoadingCountries] = useState(false);
//       const [loadingStates, setLoadingStates] = useState(false);
//       const [loadingCities, setLoadingCities] = useState(false);

//   const selectedCamera = cameras.find(
//       item => item.brand === camera 
//   );

//   const cameraBrands = cameras.map(
//       item => item.brand
//   );

//   const cameraModels =
//       selectedCamera?.models || [];
//   const popularLenses = [
//       "50mm",
//       "85mm",
//       "100mm Macro",
//       "100-400mm",
//       "200-500mm",
//       "200-600mm",
//       "300mm",
//       "400mm",
//       "500mm",
//       "600mm"
//   ];
//   useEffect(() => {
//             if(token){
//                 fetchProfile();
//             }
//         }, []);
//   useEffect(() => {
//                       if (!creator) return;
//                       console.log("edit creator : ",creator);
                      
//                       setName(creator.displayName || "");
//                       setBio(creator.bio || "");
//                       setCamera(creator.cameraBrand || "");
//                       setCameraModel(creator.cameraModel || "");
//                       setCountry(creator.country || "");
//                       setState(creator.state || "");
//                       setCity(creator.city || "");
//                       setExperience(creator.experience || "");
//                       setMainLens(creator.mainLens || "");
//                       setZoomLens(creator.zoomLens || "");
//                       setInstagram(creator.instagram || "");
//                       setWebsite(creator.website || "");
//                       setYoutube(creator.youtube || "");
//                       setProfilePreview(getImageUrl(creator.profileImage) || "");
//                       setCoverPreview(getImageUrl(creator.coverImage) || "");
//                       setCameraPreview(getImageUrl(creator.cameraImage) || "");
//                       setSpecializations(creator.specialization || []);
//                   }, [creator]);
//   const addSpecialization = () => {

//       let tag = specializationInput.trim();

//       if (!tag) return;

//       tag = tag.replace(/^#+/, "").trim();

//       if (!tag) return;

//       if (specializations.length >= 5) {
//           alert("You can add up to 5 specializations.");
//           return;
//       }

//       const exists = specializations.some(
//           item => item.toLowerCase() === tag.toLowerCase()
//       );

//       if (exists) {
//           alert("This specialization is already added.");
//           return;
//       }

//       setSpecializations(prev => [
//           ...prev,
//           tag
//       ]);

//       setSpecializationInput("");
//   };


//   const removeSpecialization = (tag) => {

//       setSpecializations(prev =>
//           prev.filter(item => item !== tag)
//       );

//   };


//   const handleSpecializationKeyDown = (e) => {

//       if (e.key === "Enter") {

//           e.preventDefault();

//           addSpecialization();

//       }

//   };
//   const handleImageChange = (event, type) => {

//       const file = event.target.files[0];

//       if (!file) return;

//       if (!file.type.startsWith("image/")) {
//           alert("Please select an image file.");
//           return;
//       }

//       if (file.size > 5 * 1024 * 1024) {
//           alert("Image must be smaller than 5 MB.");
//           return;
//       }

//       const preview = URL.createObjectURL(file);

//       if (type === "profile") {
//           setProfileImage(file);
//           setProfilePreview(preview);
//       }

//       if (type === "cover") {
//           setCoverImage(file);
//           setCoverPreview(preview);
//       }

//       if (type === "camera") {
//           setCameraImage(file);
//           setCameraPreview(preview);
//       }
//   };

//     function handleUpdate() {
//         if (!creator) return;

//         const noChanges =
//             name === creator.displayName &&
//             bio === creator.bio &&
//             camera === creator.cameraBrand &&
//             cameraModel === creator.cameraModel &&
//             country === creator.country &&
//             state === creator.state &&
//             city === creator.city &&
//             experience === creator.experience &&
//             mainLens === creator.mainLens &&
//             zoomLens === creator.zoomLens &&
//             instagram === creator.instagram &&
//             website === creator.website &&
//             youtube === creator.youtube;

//         if (noChanges) {
//             alert("No changes detected.");
//             setOpen(false);
//             return;
//         }

//         setOpen(false);
//         setOpenOtp(true);
//     }
//     useEffect(() => {
    
//             const loadCountries = async () => {
    
//                 try {
    
//                     setLoadingCountries(true);
    
//                     const response = await getCountries();
//                     console.log(response);
                    
//                     setCountries(response.data.data || []);
    
//                 } catch (error) {
    
//                     console.error(
//                         "Failed to load countries:",
//                         error
//                     );
    
//                 } finally {
    
//                     setLoadingCountries(false);
    
//                 }
//             };
    
//             loadCountries();
    
//         }, []);
//         useEffect(() => {
    
//             if (!country) {
//                 setStates([]);
//                 setCities([]);
//                 return;
//             }
    
//             const loadStates = async () => {
    
//                 try {
    
//                     setLoadingStates(true);
    
//                     setStatename("");
//                     setCity("");
//                     setCities([]);
    
//                     const response = await getStates(country);
    
//                     setStates(
//                         response.data.data || []
//                     );
    
//                 } catch (error) {
    
//                     console.error(
//                         "Failed to load states:",
//                         error
//                     );
    
//                     setStates([]);
    
//                 } finally {
    
//                     setLoadingStates(false);
    
//                 }
//             };
    
//             loadStates();
    
//         }, [country]);
//         useEffect(() => {
    
//             if (!country || !state) {
//                 setCities([]);
//                 return;
//             }
    
//             const loadCities = async () => {
    
//                 try {
    
//                     setLoadingCities(true);
    
//                     setCity("");
    
//                     const response = await getCities(
//                         country,
//                         state
//                     );
    
//                     setCities(
//                         response.data.data || []
//                     );
    
//                 } catch (error) {
    
//                     console.error(
//                         "Failed to load cities:",
//                         error
//                     );
    
//                     setCities([]);
    
//                 } finally {
    
//                     setLoadingCities(false);
    
//                 }
//             };
    
//             loadCities();
    
//         }, [country, state]);
//     const update = async () => {
//       try {
//           await creator_update({
//                 displayName: name,
//                 profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
//                 coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b",
//                 bio: bio,
//                 country: country,
//                 state: state,
//                 city: city,
//                 experience: experience,
//                 cameraBrand:camera,
//                 cameraModel:cameraModel,
//                 mainLens: mainLens,
//                 zoomLens: zoomLens,
//                 instagram: instagram,
//                 website: website,
//                 youtube: youtube,
//                 specialization: [
//                     "Bird Photography",
//                     "Wildlife",
//                     "Macro Photography",
//                     "Nature Landscapes"
//                 ],
//                 isVerified: false
//             });
//           fetchProfile();
//           setOpenOtp(false);
  
//           alert("Profile updated successfully");
  
//       } catch (err) {
//          console.log(err.response?.data || err);
//       }
//   };
//     function updateCreator() {
//           console.log("updated Creator");
//           setOpen(false);
//           setOpenOtp(true);
//     }
//   return (
//     <div>
//       <div className="w-full min-h-screen bg-white relative  ">
//             <div  className="h-full border-3 w-full pb-8 flex flex-col gap-3 ">
//                 <ProfileNavbar/>
//                 <div className="w-full  flex flex-col gap-3 items-center px-3 ">
//                    <div className="w-full lg:w-150 flex flex-col gap-3">
//                       <div className="text-sm font-bold text-black  text-start px-3 flex gap-2 items-center">
//                              <h1>Creator info</h1> <FiEdit />
//                       </div> 
//                       <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
//                                               <div className=" h-full flex flex-col justify-between  gap-2">
//                                                 <h2 className='text-[12px]  font-semibold text-gray-400'>CREATOR NAME</h2>
//                                                 <input className="w-full bg-white rounded-xl text-md px-5 py-3"
//                                                 placeholder='Enter your name' 
//                                                 value={name} 
//                                                 onChange={(e) => setName(e.target.value)}
//                                                 type="text"/>
//                                               </div>
//                       </div>
//                       <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
//                                               <div className=" h-full flex flex-col justify-between  gap-2">
//                                                 <h2 className='text-[12px]  font-semibold text-gray-400 uppercase'> BIO</h2>
//                                                 <textarea className="w-full min-h-30 bg-white rounded-xl text-md px-5 py-3"
//                                                 placeholder='Write your bio' 
//                                                 value={bio} 
//                                                 onChange={(e) => setBio(e.target.value)}
//                                                 />
//                                               </div>
//                       </div>
//                       <div className="text-start w-full rounded-xl bg-gray-100 px-4 py-3">

//                           <h2 className="text-[12px] font-semibold text-gray-400 uppercase mb-2">
//                               PROFILE PHOTO
//                           </h2>

//                           <label
//                               htmlFor="profileImage"
//                               className="relative block w-full h-44 bg-white rounded-xl overflow-hidden cursor-pointer"
//                           >

//                               {profilePreview ? (
//                                   <img
//                                       src={profilePreview}
//                                       alt="Profile"
//                                       className="w-full h-full object-cover"
//                                   />
//                               ) : (
//                                   <div className="w-full h-full flex items-center justify-center text-gray-400">
//                                       Add profile photo
//                                   </div>
//                               )}

//                               <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-2 rounded-lg text-xs">
//                                   Change
//                               </div>

//                           </label>

//                           <input
//                               id="profileImage"
//                               type="file"
//                               accept="image/*"
//                               className="hidden"
//                               onChange={(e) => handleImageChange(e, "profile")}
//                           />

//                       </div>
//                       <div className="text-start w-full rounded-xl bg-gray-100 px-4 py-3">

//                           <h2 className="text-[12px] font-semibold text-gray-400 uppercase mb-2">
//                               COVER PHOTO
//                           </h2>

//                           <label
//                               htmlFor="coverImage"
//                               className="relative block w-full h-52 bg-white rounded-xl overflow-hidden cursor-pointer group"
//                           >

//                               {coverPreview ? (
//                                   <img
//                                       src={coverPreview}
//                                       alt="Cover"
//                                       className="w-full h-full object-cover"
//                                   />
//                               ) : (
//                                   <div className="w-full h-full flex items-center justify-center text-gray-400">
//                                       Add cover photo
//                                   </div>
//                               )}

//                               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />

//                               <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-2 rounded-lg text-xs">
//                                   Change Cover
//                               </div>

//                           </label>

//                           <input
//                               id="coverImage"
//                               type="file"
//                               accept="image/*"
//                               className="hidden"
//                               onChange={(e) => handleImageChange(e, "cover")}
//                           />

//                       </div>
//                       <div className="text-start w-full rounded-xl bg-gray-100 px-4 py-3">

//                           <h2 className="text-[12px] font-semibold text-gray-400 uppercase mb-2">
//                               CAMERA PHOTO
//                           </h2>

//                           <label
//                               htmlFor="cameraImage"
//                               className="relative block w-full h-52 bg-white rounded-xl overflow-hidden cursor-pointer group"
//                           >

//                               {cameraPreview ? (
//                                   <img
//                                       src={cameraPreview}
//                                       alt="Camera"
//                                       className="w-full h-full object-cover"
//                                   />
//                               ) : (
//                                   <div className="w-full h-full flex items-center justify-center text-gray-400">
//                                       Add camera photo
//                                   </div>
//                               )}

//                               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />

//                               <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-2 rounded-lg text-xs">
//                                   Change Camera Photo
//                               </div>

//                           </label>

//                           <input
//                               id="cameraImage"
//                               type="file"
//                               accept="image/*"
//                               className="hidden"
//                               onChange={(e) => handleImageChange(e, "camera")}
//                           />

//                       </div>
//                       <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
//                         <div className="h-full flex flex-col justify-between gap-2">

//                             <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
//                                 EXPERIENCE
//                             </h2>

//                             <select
//                                 value={experience}
//                                 onChange={(e) => setExperience(e.target.value)}
//                                 className="w-full bg-white rounded-xl px-5 py-3 outline-none"
//                             >
//                                 <option value="" disabled>
//                                     Select your experience
//                                 </option>

//                                 <option value="Beginner">
//                                     Beginner
//                                 </option>

//                                 <option value="Intermediate">
//                                     Intermediate
//                                 </option>

//                                 <option value="Professional">
//                                     Professional
//                                 </option>
//                             </select>

//                         </div>
//                       </div>
//                       <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
//                                               <div className=" h-full flex flex-col justify-between  gap-2">
//                                                 <h2 className='text-[12px]  font-semibold text-gray-400'>MAIN CAMERA</h2>
//                                                 <input className="w-full bg-white rounded-xl text-md px-5 py-3"
//                                                 placeholder='Enter your camera' 
//                                                 value={camera} 
//                                                 onChange={(e) => setCamera(e.target.value)}
//                                                 type="text"/>
//                                               </div>
//                       </div>
                      
//                         <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">

//                             <div className="flex flex-col gap-2">

//                                 <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
//                                     CAMERA MODEL
//                                 </h2>

//                                 <select
//                                     value={cameraModel}
//                                     onChange={(e) => setCameraModel(e.target.value)}
//                                     disabled={!camera}
//                                     className={`w-full bg-white rounded-xl text-md px-5 py-3 outline-none ${
//                                         !camera
//                                             ? "text-gray-400 cursor-not-allowed"
//                                             : "cursor-pointer"
//                                     }`}
//                                 >

//                                     <option value="" disabled>
//                                         {camera
//                                             ? "Select camera model"
//                                             : "Select camera brand first"}
//                                     </option>

//                                     {cameraModels.map((model) => (
//                                         <option
//                                             key={model}
//                                             value={model}
//                                         >
//                                             {model}
//                                         </option>
//                                     ))}

//                                 </select>

//                             </div>

//                         </div>
//                       <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
//                                               <div className=" h-full flex flex-col justify-between  gap-2">
//                                                 <h2 className='text-[12px]  font-semibold text-gray-400'>MAIN LENS</h2>
//                                                 <input className="w-full bg-white rounded-xl text-md px-5 py-3"
//                                                 placeholder='Enter lens name' 
//                                                 value={mainLens} 
//                                                 onChange={(e) => setMainLens(e.target.value)}
//                                                 type="text"/>
//                                               </div>
//                       </div>
//                       <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
//                                               <div className=" h-full flex flex-col justify-between  gap-2">
//                                                 <h2 className='text-[12px]  font-semibold text-gray-400'>ZOOM LENS</h2>
//                                                 <input className="w-full bg-white rounded-xl text-md px-5 py-3"
//                                                 placeholder='Enter lens name' 
//                                                 value={zoomLens} 
//                                                 onChange={(e) => setZoomLens(e.target.value)}
//                                                 type="text"/>
//                                               </div>
//                       </div>
//                       <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
//                                               <div className=" h-full flex flex-col justify-between  gap-2">
//                                                 <h2 className='text-[12px]  font-semibold text-gray-400'>COUNTRY</h2>
//                                                 <input className="w-full bg-white rounded-xl text-md px-5 py-3"
//                                                 placeholder='Enter your country' 
//                                                 value={country} 
//                                                 onChange={(e) => setCountry(e.target.value)}
//                                                 type="text"/>
//                                               </div>
//                       </div>
//                       <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
//                                               <div className=" h-full flex flex-col justify-between  gap-2">
//                                                 <h2 className='text-[12px]  font-semibold text-gray-400'>STATE</h2>
//                                                 <input className="w-full bg-white rounded-xl text-md px-5 py-3"
//                                                 placeholder='Enter your state' 
//                                                 value={state} 
//                                                 onChange={(e) => setState(e.target.value)}
//                                                 type="text"/>
//                                               </div>
//                       </div>
//                       <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
//                                               <div className=" h-full flex flex-col justify-between  gap-2">
//                                                 <h2 className='text-[12px]  font-semibold text-gray-400'>CITY</h2>
//                                                 <input className="w-full bg-white rounded-xl text-md px-5 py-3"
//                                                 placeholder='Enter your city' 
//                                                 value={city} 
//                                                 onChange={(e) => setCity(e.target.value)}
//                                                 type="text"/>
//                                               </div>
//                       </div>
//                       <div className="text-start w-full rounded-xl bg-gray-100 px-4 py-3">

//                           <div className="flex flex-col gap-3">

//                               <div className="flex justify-between items-center">

//                                   <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
//                                       SPECIALIZATIONS
//                                   </h2>

//                                   <span className="text-[11px] text-gray-400">
//                                       {specializations.length}/5
//                                   </span>

//                               </div>

//                               {specializations.length > 0 && (

//                                   <div className="flex flex-wrap gap-2">

//                                       {specializations.map(tag => (

//                                           <div
//                                               key={tag}
//                                               className="flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-3 py-1.5 text-sm"
//                                           >

//                                               <span>
//                                                   #{tag}
//                                               </span>

//                                               <button
//                                                   type="button"
//                                                   onClick={() => removeSpecialization(tag)}
//                                                   className="font-bold hover:text-red-500"
//                                               >
//                                                   ×
//                                               </button>

//                                           </div>

//                                       ))}

//                                   </div>

//                               )}

//                               <div className="flex gap-2">

//                                   <input
//                                       type="text"
//                                       value={specializationInput}
//                                       onChange={(e) =>
//                                           setSpecializationInput(e.target.value)
//                                       }
//                                       onKeyDown={handleSpecializationKeyDown}
//                                       placeholder="#addspecialization"
//                                       className="flex-1 bg-white rounded-xl px-5 py-3 outline-none"
//                                   />

//                                   <button
//                                       type="button"
//                                       onClick={addSpecialization}
//                                       className="px-5 rounded-xl bg-blue-500 text-white font-semibold"
//                                   >
//                                       Add
//                                   </button>

//                               </div>

//                           </div>

//                       </div>

//                       <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">

//                             <div className="flex flex-col gap-2">

//                                 <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
//                                     COUNTRY
//                                 </h2>

//                                 <select
//                                     value={country}
//                                     onChange={(e) => setCountry(e.target.value)}
//                                     disabled={loadingCountries}
//                                     className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none cursor-pointer"
//                                 >
//                                     <option value="" disabled>
//                                         {loadingCountries
//                                             ? "Loading countries..."
//                                             : "Select country"}
//                                     </option>

//                                     {countries.map((item) => (
//                                         <option
//                                             key={item.iso2}
//                                             value={item.country}
//                                         >
//                                             {item.country}
//                                         </option>
//                                     ))}
//                                 </select>

//                             </div>

//                       </div>
//                       <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">

//                             <div className="flex flex-col gap-2">

//                                 <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
//                                     STATE
//                                 </h2>

//                                 <select
//                                     value={state}
//                                     onChange={(e) => setStatename(e.target.value)}
//                                     disabled={!country || loadingStates}
//                                     className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none cursor-pointer"
//                                 >
//                                     <option value="" disabled>
//                                         {!country
//                                             ? "Select country first"
//                                             : loadingStates
//                                             ? "Loading states..."
//                                             : "Select state"}
//                                     </option>

//                                     {states.map((stateItem) => (

//                                         <option
//                                             key={stateItem.state_code}
//                                             value={stateItem.name}
//                                         >
//                                             {stateItem.name}
//                                         </option>

//                                     ))}
//                                 </select>

//                             </div>

//                       </div>
//                       <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">

//                             <div className="flex flex-col gap-2">

//                                 <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
//                                     CITY
//                                 </h2>

//                                 <select
//                                     value={city}
//                                     onChange={(e) => setCity(e.target.value)}
//                                     disabled={!state || loadingCities}
//                                     className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none cursor-pointer"
//                                 >
//                                     <option value="" disabled>
//                                         {!state
//                                             ? "Select state first"
//                                             : loadingCities
//                                             ? "Loading cities..."
//                                             : "Select city"}
//                                     </option>

//                                     {cities.map((cityName) => (
//                                         <option
//                                             key={cityName}
//                                             value={cityName}
//                                         >
//                                             {cityName}
//                                     </option>
//                                     ))}
//                                 </select>

//                             </div>

//                       </div>

//                       <button onClick={()=>handleUpdate()} style={{backgroundColor:'#3d84cd'}}  className="w-full rounded-xl min-h-10 px-4 py-3 text-black flex gap-1 justify-center shadow-2xl">
//                                   <MdOutlineUpdate className='text-2xl' />
//                                   <p className='text-sm font-bold'>Update</p>
//                       </button>
//                       <ConfirmModal
//                           isOpen={open}
//                           title="Update Creator"
//                           message="Are you sure about your update details?"
//                           confirmText="Update"
//                           cancelText="Cancel"
//                           onConfirm={updateCreator}
//                           onCancel={() => setOpen(false)}
//                           setOpen={setOpen}
//                       />     
//                       <OtpModal
//                         isOpen={openOtp}
//                         title="Verify OTP"
//                         message="Enter the OTP sent to your registered email."
//                         confirmText="Verify OTP"
//                         cancelText="Cancel"
//                         purpose="creator-update"
//                         onConfirm={update}
//                         onCancel={() => setOpenOtp(false)}
//                         setOpen={setOpenOtp}
//                     />           
//                   </div>
//               </div>

//             </div>
      
      
           
//       </div>
//     </div>
//   )
// }

// export default Edit_creator


import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineUpdate } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import ProfileNavbar from "../components/ProfileNavbar";
import ConfirmModal from "../components/ConfirmModal";
import OtpModal from "../components/OtpModal";
import AppContext from "../context/AppContext";
import { creator_info, creator_update } from "../services/creatorService";
import { getImageUrl } from "../utils/imageUrl";
import cameras from "../data/cameras";
import { getCountries, getStates, getCities } from "../services/locationService";

const popularLenses = [
    "50mm", "85mm", "100mm Macro", "100-400mm", "200-500mm",
    "200-600mm", "300mm", "400mm", "500mm", "600mm"
];

const sameArray = (a = [], b = []) =>
    JSON.stringify(a) === JSON.stringify(b);

const Edit_creator = () => {
    const navigate = useNavigate();
    const { creator, setCreator, token, fetchProfile } = useContext(AppContext);

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [camera, setCamera] = useState("");
    const [cameraModel, setCameraModel] = useState("");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [experience, setExperience] = useState("");
    const [mainLens, setMainLens] = useState("");
    const [zoomLens, setZoomLens] = useState("");
    const [instagram, setInstagram] = useState("");
    const [website, setWebsite] = useState("");
    const [youtube, setYoutube] = useState("");

    const [specializations, setSpecializations] = useState([]);
    const [specializationInput, setSpecializationInput] = useState("");

    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [cameraImage, setCameraImage] = useState(null);
    const [profilePreview, setProfilePreview] = useState("");
    const [coverPreview, setCoverPreview] = useState("");
    const [cameraPreview, setCameraPreview] = useState("");

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [locationReady, setLocationReady] = useState(false);

    const [open, setOpen] = useState(false);
    const [openOtp, setOpenOtp] = useState(false);
    const [saving, setSaving] = useState(false);

    const selectedCamera = useMemo(
        () => cameras.find((item) => item.brand === camera),
        [camera]
    );
    const cameraBrands = useMemo(
        () => cameras.map((item) => item.brand),
        []
    );
    const cameraModels = selectedCamera?.models || [];

    const fetchCreator = async () => {
        try {
            const response = await creator_info();
            const data = response.data?.data?.creator;
            if (data) setCreator(data);
        } catch (error) {
            console.error("Failed to load creator:", error);
        }
    };

    useEffect(() => {
        if (token) fetchCreator();
    }, [token]);

    // Load countries once.
    useEffect(() => {
        const loadCountries = async () => {
            try {
                setLoadingCountries(true);
                const response = await getCountries();
                setCountries(response.data?.data || []);
            } catch (error) {
                console.error("Failed to load countries:", error);
            } finally {
                setLoadingCountries(false);
            }
        };
        loadCountries();
    }, []);

    // Load existing creator values. Location options are loaded separately below.
    useEffect(() => {
        if (!creator) return;

        setName(creator.displayName || "");
        setBio(creator.bio || "");
        setCamera(creator.cameraBrand || "");
        setCameraModel(creator.cameraModel || "");
        setCountry(creator.country || "");
        setState(creator.state || "");
        setCity(creator.city || "");
        setExperience(creator.experience || "");
        setMainLens(creator.mainLens || "");
        setZoomLens(creator.zoomLens || "");
        setInstagram(creator.instagram || "");
        setWebsite(creator.website || "");
        setYoutube(creator.youtube || "");
        setSpecializations(creator.specialization || []);

        setProfilePreview(getImageUrl(creator.profileImage));
        setCoverPreview(getImageUrl(creator.coverImage));
        setCameraPreview(getImageUrl(creator.cameraImage));
        setLocationReady(true);
    }, [creator]);

    // Load states when country changes. During initial hydration we keep the saved state/city.
    useEffect(() => {
        if (!country) {
            setStates([]);
            setCities([]);
            return;
        }

        let cancelled = false;
        const loadStates = async () => {
            try {
                setLoadingStates(true);
                const response = await getStates(country);
                if (cancelled) return;
                const data = response.data?.data || [];
                setStates(data);

                if (!locationReady) return;
                const savedState = creator?.state || "";
                if (!savedState) setState("");
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load states:", error);
                    setStates([]);
                }
            } finally {
                if (!cancelled) setLoadingStates(false);
            }
        };

        loadStates();
        return () => { cancelled = true; };
    }, [country]);

    // Load cities when state changes.
    useEffect(() => {
        if (!country || !state) {
            setCities([]);
            return;
        }

        let cancelled = false;
        const loadCities = async () => {
            try {
                setLoadingCities(true);
                const response = await getCities(country, state);
                if (cancelled) return;
                setCities(response.data?.data || []);
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load cities:", error);
                    setCities([]);
                }
            } finally {
                if (!cancelled) setLoadingCities(false);
            }
        };

        loadCities();
        return () => { cancelled = true; };
    }, [country, state]);

    const handleCountryChange = (value) => {
        setCountry(value);
        setState("");
        setCity("");
        setStates([]);
        setCities([]);
    };

    const handleStateChange = (value) => {
        setState(value);
        setCity("");
        setCities([]);
    };

    const handleCameraChange = (value) => {
        setCamera(value);
        setCameraModel("");
    };

    const handleImageChange = (event, type) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be smaller than 5 MB.");
            return;
        }

        const preview = URL.createObjectURL(file);
        if (type === "profile") {
            setProfileImage(file);
            setProfilePreview(preview);
        } else if (type === "cover") {
            setCoverImage(file);
            setCoverPreview(preview);
        } else if (type === "camera") {
            setCameraImage(file);
            setCameraPreview(preview);
        }
    };

    useEffect(() => {
        return () => {
            [profilePreview, coverPreview, cameraPreview]
                .filter((url) => url?.startsWith("blob:"))
                .forEach((url) => URL.revokeObjectURL(url));
        };
    }, [profilePreview, coverPreview, cameraPreview]);

    const addSpecialization = () => {
        let tag = specializationInput.trim().replace(/^#+/, "").trim();
        if (!tag) return;

        if (specializations.length >= 5) {
            alert("You can add up to 5 specializations.");
            return;
        }
        if (tag.length < 3) {
            alert("Specialization must be at least 3 characters.");
            return;
        }
        if (tag.length > 30) {
            alert("Specialization cannot exceed 30 characters.");
            return;
        }
        if (specializations.some((item) => item.toLowerCase() === tag.toLowerCase())) {
            alert("This specialization is already added.");
            return;
        }

        setSpecializations((prev) => [...prev, tag]);
        setSpecializationInput("");
    };

    const removeSpecialization = (tag) => {
        setSpecializations((prev) => prev.filter((item) => item !== tag));
    };

    const handleSpecializationKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addSpecialization();
        }
    };

    const hasChanges = () => {
        if (!creator) return false;
        return (
            name !== (creator.displayName || "") ||
            bio !== (creator.bio || "") ||
            camera !== (creator.cameraBrand || "") ||
            cameraModel !== (creator.cameraModel || "") ||
            country !== (creator.country || "") ||
            state !== (creator.state || "") ||
            city !== (creator.city || "") ||
            experience !== (creator.experience || "") ||
            mainLens !== (creator.mainLens || "") ||
            zoomLens !== (creator.zoomLens || "") ||
            instagram !== (creator.instagram || "") ||
            website !== (creator.website || "") ||
            youtube !== (creator.youtube || "") ||
            !sameArray(specializations, creator.specialization || []) ||
            Boolean(profileImage) ||
            Boolean(coverImage) ||
            Boolean(cameraImage)
        );
    };

    const handleUpdate = () => {
        if (!creator) return;
        if (!hasChanges()) {
            alert("No changes detected.");
            return;
        }
        setOpen(true);
    };

    const updateCreator = () => {
        setOpen(false);
        setOpenOtp(true);
    };

    const update = async () => {

        try {

            const formData = new FormData();

            // -----------------------------
            // TEXT DATA
            // -----------------------------

            formData.append("displayName", name);
            formData.append("bio", bio);

            formData.append("country", country);
            formData.append("state", state);
            formData.append("city", city);

            formData.append("experience", experience);

            formData.append("cameraBrand", camera);
            formData.append("cameraModel", cameraModel);

            formData.append("mainLens", mainLens);
            formData.append("zoomLens", zoomLens);

            formData.append("instagram", instagram);
            formData.append("website", website);
            formData.append("youtube", youtube);


            // -----------------------------
            // SPECIALIZATIONS
            // -----------------------------

            formData.append(
                "specialization",
                JSON.stringify(specializations)
            );


            // -----------------------------
            // OPTIONAL IMAGES
            // -----------------------------

            if (profileImage) {
                formData.append(
                    "profileImage",
                    profileImage
                );
            }

            if (coverImage) {
                formData.append(
                    "coverImage",
                    coverImage
                );
            }

            if (cameraImage) {
                formData.append(
                    "cameraImage",
                    cameraImage
                );
            }


            // -----------------------------
            // DEBUG
            // -----------------------------

            console.log("Creator update FormData:");

            for (const [key, value] of formData.entries()) {

                if (value instanceof File) {
                    console.log(
                        key,
                        value.name,
                        value.type,
                        value.size
                    );
                } else {
                    console.log(key, value);
                }

            }


            // -----------------------------
            // API
            // -----------------------------

            const response =
                await creator_update(formData);

            console.log(
                "Creator updated:",
                response.data
            );


            // Refresh creator data
            await fetchProfile();

            setOpenOtp(false);

            alert(
                "Creator profile updated successfully."
            );

        } catch (err) {

            console.error(
                "Creator update failed:",
                err.response?.data || err
            );

            alert(
                err.response?.data?.message ||
                "Failed to update creator profile."
            );

        }

    };
    const currentSpecializations =
        creator.specialization || [];

    const tagsChanged =
        JSON.stringify(specializations) !==
        JSON.stringify(currentSpecializations);

    const imageChanged =
        profileImage !== null ||
        coverImage !== null ||
        cameraImage !== null;

    const noChanges =
        name === (creator.displayName || "") &&
        bio === (creator.bio || "") &&
        camera === (creator.cameraBrand || "") &&
        cameraModel === (creator.cameraModel || "") &&
        country === (creator.country || "") &&
        state === (creator.state || "") &&
        city === (creator.city || "") &&
        experience === (creator.experience || "") &&
        mainLens === (creator.mainLens || "") &&
        zoomLens === (creator.zoomLens || "") &&
        instagram === (creator.instagram || "") &&
        website === (creator.website || "") &&
        youtube === (creator.youtube || "") &&
        !tagsChanged &&
        !imageChanged;

    const inputClass = "w-full bg-white rounded-xl text-md px-5 py-3 outline-none";
    const sectionClass = "text-start w-full rounded-xl bg-gray-100 px-4 py-3 text-black";

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="w-full pb-8 flex flex-col gap-3">
                <ProfileNavbar />

                <div className="w-full flex flex-col gap-3 items-center px-3">
                    <div className="w-full lg:w-150 flex flex-col gap-3">
                        <div className="text-sm font-bold text-black text-start px-3 flex gap-2 items-center">
                            <h1>Creator info</h1>
                            <FiEdit />
                        </div>

                        <div className={sectionClass}>
                            <h2 className="text-[12px] font-semibold text-gray-400 uppercase mb-2">CREATOR NAME</h2>
                            <input className={inputClass} placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className={sectionClass}>
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-[12px] font-semibold text-gray-400 uppercase">BIO</h2>
                                <span className="text-[11px] text-gray-400">{bio.length}/500</span>
                            </div>
                            <textarea maxLength={500} className={`${inputClass} min-h-30`} placeholder="Write your bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                        </div>

                        {[
                            ["PROFILE PHOTO", "profile", profilePreview, "profileImage", "Change"],
                            ["COVER PHOTO", "cover", coverPreview, "coverImage", "Change Cover"],
                            ["CAMERA PHOTO", "camera", cameraPreview, "cameraImage", "Change Camera Photo"],
                        ].map(([title, type, preview, id, label]) => (
                            <div className={sectionClass} key={id}>
                                <h2 className="text-[12px] font-semibold text-gray-400 uppercase mb-2">{title}</h2>
                                <label htmlFor={id} className={`relative block w-full ${type === "profile" ? "h-44" : "h-52"} bg-white rounded-xl overflow-hidden cursor-pointer group`}>
                                    {preview ? (
                                        <img src={preview} alt={title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">Add {title.toLowerCase()}</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-2 rounded-lg text-xs">{label}</div>
                                </label>
                                <input id={id} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, type)} />
                            </div>
                        ))}

                        <div className={sectionClass}>
                            <h2 className="text-[12px] font-semibold text-gray-400 uppercase mb-2">EXPERIENCE</h2>
                            <select value={experience} onChange={(e) => setExperience(e.target.value)} className={inputClass}>
                                <option value="" disabled>Select your experience</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Professional">Professional</option>
                            </select>
                        </div>

                        <div className={sectionClass}>
                            <h2 className="text-[12px] font-semibold text-gray-400 uppercase mb-2">CAMERA BRAND</h2>
                            <select value={camera} onChange={(e) => handleCameraChange(e.target.value)} className={inputClass}>
                                <option value="" disabled>Select camera brand</option>
                                {cameraBrands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                            </select>
                        </div>

                        <div className={sectionClass}>
                            <h2 className="text-[12px] font-semibold text-gray-400 uppercase mb-2">CAMERA MODEL</h2>
                            <select value={cameraModel} onChange={(e) => setCameraModel(e.target.value)} disabled={!camera} className={`${inputClass} ${!camera ? "text-gray-400" : ""}`}>
                                <option value="" disabled>{camera ? "Select camera model" : "Select camera brand first"}</option>
                                {cameraModels.map((model) => <option key={model} value={model}>{model}</option>)}
                            </select>
                        </div>

                        <div className={sectionClass}>
                            <h2 className="text-[12px] font-semibold text-gray-400 uppercase mb-2">MAIN LENS</h2>
                            <input className={inputClass} placeholder="e.g. 100-400mm f/4.5-5.6" value={mainLens} onChange={(e) => setMainLens(e.target.value)} />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {popularLenses.slice(0, 5).map((lens) => <button type="button" key={lens} onClick={() => setMainLens(lens)} className="px-3 py-1.5 rounded-full bg-white text-xs text-gray-600 hover:text-blue-600">{lens}</button>)}
                            </div>
                        </div>

                        <div className={sectionClass}>
                            <h2 className="text-[12px] font-semibold text-gray-400 uppercase mb-2">ZOOM LENS</h2>
                            <input className={inputClass} placeholder="e.g. 200-600mm f/5.6-6.3" value={zoomLens} onChange={(e) => setZoomLens(e.target.value)} />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {popularLenses.filter((lens) => lens.includes("-")).map((lens) => <button type="button" key={lens} onClick={() => setZoomLens(lens)} className="px-3 py-1.5 rounded-full bg-white text-xs text-gray-600 hover:text-blue-600">{lens}</button>)}
                            </div>
                        </div>

                        <div className={sectionClass}>
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-[12px] font-semibold text-gray-400 uppercase">SPECIALIZATIONS</h2>
                                <span className="text-[11px] text-gray-400">{specializations.length}/5</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {specializations.map((tag) => (
                                    <div key={tag} className="flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-3 py-1.5 text-sm">
                                        <span>#{tag}</span>
                                        <button type="button" onClick={() => removeSpecialization(tag)} className="font-bold hover:text-red-500">×</button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input className={`flex-1 ${inputClass}`} value={specializationInput} onChange={(e) => setSpecializationInput(e.target.value)} onKeyDown={handleSpecializationKeyDown} placeholder="#birdphotography" />
                                <button type="button" onClick={addSpecialization} className="px-5 rounded-xl bg-blue-500 text-white font-semibold">Add</button>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-2">Add up to 5 specializations. Press Enter to add.</p>
                        </div>

                        <div className={sectionClass}>
                            <h2 className="text-[12px] font-semibold text-gray-400 uppercase mb-2">COUNTRY</h2>
                            <select value={country} onChange={(e) => handleCountryChange(e.target.value)} disabled={loadingCountries} className={inputClass}>
                                <option value="" disabled>{loadingCountries ? "Loading countries..." : "Select country"}</option>
                                {countries.map((item) => <option key={item.iso2} value={item.country}>{item.country}</option>)}
                            </select>
                        </div>

                        <div className={sectionClass}>
                            <h2 className="text-[12px] font-semibold text-gray-400 uppercase mb-2">STATE</h2>
                            <select value={state} onChange={(e) => handleStateChange(e.target.value)} disabled={!country || loadingStates} className={inputClass}>
                                <option value="" disabled>{!country ? "Select country first" : loadingStates ? "Loading states..." : "Select state"}</option>
                                {states.map((item) => <option key={item.state_code} value={item.name}>{item.name}</option>)}
                            </select>
                        </div>

                        <div className={sectionClass}>
                            <h2 className="text-[12px] font-semibold text-gray-400 uppercase mb-2">CITY</h2>
                            <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!state || loadingCities} className={inputClass}>
                                <option value="" disabled>{!state ? "Select state first" : loadingCities ? "Loading cities..." : "Select city"}</option>
                                {cities.map((cityName) => <option key={cityName} value={cityName}>{cityName}</option>)}
                            </select>
                        </div>

                        {[
                            ["INSTAGRAM", instagram, setInstagram, "https://instagram.com/yourname"],
                            ["WEBSITE", website, setWebsite, "https://yourwebsite.com"],
                            ["YOUTUBE", youtube, setYoutube, "https://youtube.com/@yourname"],
                        ].map(([label, value, setter, placeholder]) => (
                            <div className={sectionClass} key={label}>
                                <h2 className="text-[12px] font-semibold text-gray-400 uppercase mb-2">{label}</h2>
                                <input type="url" className={inputClass} placeholder={placeholder} value={value} onChange={(e) => setter(e.target.value)} />
                            </div>
                        ))}

                        <button disabled={saving} onClick={handleUpdate} style={{ backgroundColor: "#3d84cd" }} className="w-full rounded-xl min-h-10 px-4 py-3 text-white flex gap-1 justify-center items-center shadow-2xl disabled:opacity-60">
                            <MdOutlineUpdate className="text-2xl" />
                            <p className="text-sm font-bold">{saving ? "Updating..." : "Update"}</p>
                        </button>

                        <ConfirmModal
                            isOpen={open}
                            title="Update Creator"
                            message="Are you sure about your update details?"
                            confirmText="Update"
                            cancelText="Cancel"
                            onConfirm={updateCreator}
                            onCancel={() => setOpen(false)}
                            setOpen={setOpen}
                        />

                        <OtpModal
                            isOpen={openOtp}
                            title="Verify OTP"
                            message="Enter the OTP sent to your registered email."
                            confirmText="Verify OTP"
                            cancelText="Cancel"
                            purpose="creator-update"
                            onConfirm={update}
                            onCancel={() => setOpenOtp(false)}
                            setOpen={setOpenOtp}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Edit_creator;
