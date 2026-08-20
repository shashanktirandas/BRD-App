import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
import { IoCloudUploadOutline } from 'react-icons/io5'
import ProfileNavbar from '../components/ProfileNavbar'
import { VscDiffAdded } from 'react-icons/vsc'
import { CiCircleMinus } from 'react-icons/ci'
import { creator_info, post_upload } from '../services/creatorService'
import AppContext from '../context/AppContext'
import cameras from "../data/cameras"; 
import {
    getCountries,
    getStates,
    getCities
} from "../services/locationService";

const Upload = () => {
  const {creator,token,setCreator,fetchPosts}=useContext(AppContext);
  const [img, setImg] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [birdName, setbirdName] = useState('');
  const [scientificName, setscientificName] = useState('');
  const [discription, setDiscription] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [cameraBrand, setCameraBrand] = useState('');
  const [cameraModel, setCameraModel] = useState('');
  const [lens, setLens] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [open, setOpen] = useState(false)
  const navigate=useNavigate();

  const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    const popularLenses = [
        "50mm",
        "85mm",
        "100mm Macro",
        "100-400mm",
        "200-500mm",
        "200-600mm",
        "300mm",
        "400mm",
        "500mm",
        "600mm"
    ];

  const selectedCamera = cameras.find(
        (item) => item.brand === cameraBrand
    );

    const cameraBrands = cameras.map(
        (item) => item.brand
    );

    const cameraModels =
        selectedCamera?.models || [];
    const addTag = () => {

        let tag = tagInput.trim();

        if (!tag) return;

        // Remove # if user typed it
        tag = tag.replace(/^#+/, '').trim();

        if (!tag) return;

        // Maximum 5 tags
        if (tags.length >= 5) {
            alert("You can add up to 5 tags.");
            return;
        }

        // Prevent duplicate tags
        const alreadyExists = tags.some(
            existingTag =>
                existingTag.toLowerCase() === tag.toLowerCase()
        );

        if (alreadyExists) {
            alert("This tag is already added.");
            return;
        }

        setTags(prev => [...prev, tag]);

        // Clear input
        setTagInput('');
    };


    const handleTagKeyDown = (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            addTag();

        }

    };


    const removeTag = (tagToRemove) => {

        setTags(prev =>
            prev.filter(tag => tag !== tagToRemove)
        );

    };
  const fetchProfile = async () => {
              try {                
                      const creatorResponse = await creator_info();    
                      setCreator(creatorResponse.data.data.creator);
                      
              } catch (err) {
                  console.log(err);
              }
          };
          useEffect(() => {
              if(token){
                  fetchProfile();
              }
          }, []);
          useEffect(() => {
                        if (!creator) return;
                        //console.log(creator);
                        
                        //setImg('https://app.agilitywriter.ai/img/2023/08/30/p84846-Composition-and-Technique-in-Bird-Photography-fff4a2f9f9-488671660.jpg');
                        setCameraBrand(creator.cameraBrand || "");
                        setCameraModel(creator.cameraModel || "");
                        setCountry(creator.country || "");
                        setState(creator.state || "");
                        setCity(creator.city || "");
                        setLens(creator.mainLens || "");
                    }, [creator]);
  function handleUpload(){
         // Validate all fields
    const validations = [
      { value: img, message: "Please select a bird photo." },
      { value: birdName, message: "Please enter the bird name." },
      { value: scientificName, message: "Please enter the scientific name." },
      { value: discription, message: "Please enter the bird description." },
      {value: tags.length, message: "Please add at least one tag." },
      { value: cameraBrand, message: "Please enter the camera brand." },
      { value: cameraModel, message: "Please enter the camera model." },
      { value: lens, message: "Please enter the lens name." },
      { value: country, message: "Please enter the country." },
      { value: state, message: "Please enter the state." },
      { value: city, message: "Please enter the city." }
    ];

    for (const field of validations) {
      if (
        !field.value ||
        (typeof field.value === "string" && !field.value.trim())
      ) {
        alert(field.message);
        return;
      }
    }
    setOpen(true);
  }
  async function uploadPost() {

      try {

          if (!imageFile) {

              alert(
                  "Please select a bird photo."
              );

              return;

          }


          const formData =
              new FormData();


          // ==========================================
          // IMAGE
          // ==========================================

          formData.append(
              "image",
              imageFile
          );


          // ==========================================
          // POST DATA
          // ==========================================

          formData.append(
              "birdName",
              birdName
          );

          formData.append(
              "scientificName",
              scientificName
          );

          formData.append(
              "description",
              discription
          );

          formData.append(
              "country",
              country
          );

          formData.append(
              "state",
              state
          );

          formData.append(
              "city",
              city
          );

          formData.append(
              "capturedAt",
              new Date().toISOString()
          );

          formData.append(
              "cameraBrand",
              cameraBrand
          );

          formData.append(
              "cameraModel",
              cameraModel
          );

          formData.append(
              "lens",
              lens
          );


          // ==========================================
          // TAGS
          // ==========================================

          tags.forEach((tag) => {
                formData.append("tags", tag);
            });


          // ==========================================
          // API
          // ==========================================

          await post_upload(
              formData
          );


          setOpen(false);

          await fetchPosts();

          navigate("/");


      } catch (error) {

          console.error(
              "POST UPLOAD ERROR:",
              error
          );


          alert(
              error?.response?.data?.message ||
              "Failed to upload post."
          );

      }

  }
  function handleImage(e) {

      const file =
          e.target.files[0];

      if (!file) {
          return;
      }


      // Validate image
      if (!file.type.startsWith("image/")) {

          alert(
              "Please select an image file."
          );

          return;

      }


      // 5 MB limit
      if (
          file.size >
          5 * 1024 * 1024
      ) {

          alert(
              "Image must be smaller than 5 MB."
          );

          return;

      }


      setImageFile(file);

      setImg(
          URL.createObjectURL(file)
      );

  }
  function removeImage() {

      setImg(null);

      setImageFile(null);

  }

    useEffect(() => {

        const loadCountries = async () => {

            try {

                setLoadingCountries(true);

                const response =
                    await getCountries();

                setCountries(
                    response.data.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to load countries",
                    error
                );

            } finally {

                setLoadingCountries(false);

            }
        };

        loadCountries();

    }, []);
    useEffect(() => {

        if (!country) {
            setStates([]);
            setCities([]);
            return;
        }

        const loadStates = async () => {

            try {

                setLoadingStates(true);

                setState("");
                setCity("");
                setCities([]);

                const response =
                    await getStates(country);

                setStates(
                    response.data.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to load states",
                    error
                );

                setStates([]);

            } finally {

                setLoadingStates(false);

            }
        };

        loadStates();

    }, [country]);
    useEffect(() => {

        if (!country || !state) {
            setCities([]);
            return;
        }

        const loadCities = async () => {

            try {

                setLoadingCities(true);

                setCity("");

                const response =
                    await getCities(
                        country,
                        state
                    );

                setCities(
                    response.data.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to load cities",
                    error
                );

                setCities([]);

            } finally {

                setLoadingCities(false);

            }
        };

        loadCities();

    }, [country, state]);
  return (
    <div>
      <div className="w-full min-h-screen bg-white relative  ">
            <div  className="h-full border-3 w-full pb-8 flex flex-col gap-3 ">
                <ProfileNavbar/>
                <div className="w-full  flex flex-col gap-3 items-center px-3 ">
                   <div className="w-full lg:w-150 flex flex-col gap-3">
                      <div className="text-sm font-bold text-black  text-start px-3">
                              Post info  
                      </div> 
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                                              <div className=" h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400'>Photo</h2>
                                                {!img && (
                                                        <>
                                                          <label
                                                            htmlFor="image"
                                                            className="w-full h-30 bg-white rounded-xl flex justify-center items-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500"
                                                          >
                                                            <VscDiffAdded className="text-5xl text-gray-500" />
                                                          </label>

                                                          <input
                                                            id="image"
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={handleImage}
                                                          />
                                                        </>
                                                      )}

                                                      {img && (
                                                                <div className="relative inline-block">
                                                                  <img
                                                                    src={img}
                                                                    alt="Preview"
                                                                    className="w-64  rounded-xl object-cover"
                                                                  />

                                                                  <CiCircleMinus
                                                                    onClick={removeImage}
                                                                    className="absolute top-2 left-58 text-md bg-white rounded-full text-red-500 cursor-pointer hover:scale-110 transition"
                                                                  />
                                                                </div>
                                                              )}
                                              </div>
                      </div>
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                                              <div className=" h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400'>Bird name</h2>
                                                <input className="w-full bg-white rounded-xl text-md px-5 py-3"
                                                placeholder='Enter bird name' 
                                                value={birdName} 
                                                onChange={(e) => setbirdName(e.target.value)}
                                                type="text"/>
                                              </div>
                      </div>
                      
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                                              <div className=" h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400'>Scientific name</h2>
                                                <input className="w-full bg-white rounded-xl text-md px-5 py-3"
                                                placeholder='Enter scientific name' 
                                                value={scientificName} 
                                                onChange={(e) => setscientificName(e.target.value)}
                                                type="text"/>
                                              </div>
                      </div>
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                                              <div className=" h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400 '> Discription</h2>
                                                <textarea className="w-full min-h-30 bg-white rounded-xl text-md px-5 py-3"
                                                placeholder='Enter your post discription' 
                                                value={discription} 
                                                onChange={(e) => setDiscription(e.target.value)}
                                                />
                                              </div>
                      </div> 
                        <div className="text-start w-full rounded-xl bg-gray-100 px-4 py-3 text-black">

                            <div className="flex flex-col gap-3">

                                {/* Header */}

                                <div className="flex items-center justify-between">

                                    <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
                                        TAGS
                                    </h2>

                                    <span className="text-[11px] text-gray-400">
                                        {tags.length}/5
                                    </span>

                                </div>


                                {/* Added Tags */}

                                {tags.length > 0 && (

                                    <div className="flex flex-wrap gap-2">

                                        {tags.map((tag) => (

                                            <div
                                                key={tag}
                                                className="flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-3 py-1.5 text-sm"
                                            >

                                                <span>
                                                    #{tag}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="font-bold hover:text-red-500"
                                                >
                                                    ×
                                                </button>

                                            </div>

                                        ))}

                                    </div>

                                )}


                                {/* Input */}

                                <div className="flex gap-2">

                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        placeholder="#birdphotography"
                                        className="flex-1 bg-white rounded-xl text-md px-5 py-3 outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="px-5 rounded-xl bg-blue-500 text-white font-semibold"
                                    >
                                        Add
                                    </button>

                                </div>


                                <p className="text-[11px] text-gray-400">
                                    Add up to 5 tags. Press Enter to add.
                                </p>

                            </div>

                        </div>
                    <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">

                        <div className="flex flex-col gap-2">

                            <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
                                CAMERA BRAND
                            </h2>

                            <select
                                value={cameraBrand}
                                onChange={(e) => {
                                    setCameraBrand(e.target.value);
                                    setCameraModel("");
                                }}
                                className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none"
                            >
                                <option value="" disabled>
                                    Select camera brand
                                </option>

                                {cameraBrands.map((brand) => (
                                    <option
                                        key={brand}
                                        value={brand}
                                    >
                                        {brand}
                                    </option>
                                ))}
                            </select>
                        </div>

                      </div>

                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">

                            <div className="flex flex-col gap-2">

                                <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
                                    CAMERA MODEL
                                </h2>

                                <select
                                    value={cameraModel}
                                    onChange={(e) =>
                                        setCameraModel(e.target.value)
                                    }
                                    disabled={!cameraBrand}
                                    className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none"
                                >
                                    <option value="" disabled>
                                        {!cameraBrand
                                            ? "Select camera brand first"
                                            : "Select camera model"}
                                    </option>

                                    {cameraModels.map((model) => (
                                        <option
                                            key={model}
                                            value={model}
                                        >
                                            {model}
                                        </option>
                                    ))}
                                </select>

                            </div>

                        </div>
                      
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                            <div className="h-full flex flex-col justify-between gap-3">

                                <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
                                    MAIN LENS
                                </h2>

                                <input
                                    className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none"
                                    placeholder="e.g. RF 100-500mm f/4.5-7.1"
                                    value={lens}
                                    onChange={(e) => setLens(e.target.value)}
                                    type="text"
                                />

                                <div className="flex flex-wrap gap-2">

                                    {[
                                        "50mm",
                                        "85mm",
                                        "100mm Macro",
                                        "100-400mm",
                                        "200-500mm"
                                    ].map((item) => (

                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setLens(item)}
                                            className="px-3 py-1.5 rounded-full bg-white text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
                                        >
                                            {item}
                                        </button>

                                    ))}

                                </div>

                            </div>
                        </div>
                        <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                            <div className="h-full flex flex-col justify-between gap-2">

                                <h2 className="text-[12px] font-semibold text-gray-400">
                                    COUNTRY
                                </h2>

                                <select
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    disabled={loadingCountries}
                                    className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none cursor-pointer"
                                >
                                    <option value="" disabled>
                                        {loadingCountries
                                            ? "Loading countries..."
                                            : "Select country"}
                                    </option>

                                    {countries.map((item) => (
                                        <option
                                            key={item.iso2}
                                            value={item.country}
                                        >
                                            {item.country}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>
                        <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                            <div className="h-full flex flex-col justify-between gap-2">

                                <h2 className="text-[12px] font-semibold text-gray-400">
                                    STATE
                                </h2>

                                <select
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    disabled={!country || loadingStates}
                                    className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none cursor-pointer"
                                >
                                    <option value="" disabled>
                                        {!country
                                            ? "Select country first"
                                            : loadingStates
                                            ? "Loading states..."
                                            : "Select state"}
                                    </option>

                                    {states.map((item) => (
                                        <option
                                            key={item.state_code}
                                            value={item.name}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>
                        <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                            <div className="h-full flex flex-col justify-between gap-2">

                                <h2 className="text-[12px] font-semibold text-gray-400">
                                    CITY
                                </h2>

                                <select
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    disabled={!state || loadingCities}
                                    className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none cursor-pointer"
                                >
                                    <option value="" disabled>
                                        {!state
                                            ? "Select state first"
                                            : loadingCities
                                            ? "Loading cities..."
                                            : "Select city"}
                                    </option>

                                    {cities.map((cityName) => (
                                        <option
                                            key={cityName}
                                            value={cityName}
                                        >
                                            {cityName}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>

                      <button onClick={()=>handleUpload()} style={{backgroundColor:'#3d84cd'}}  className="w-full rounded-xl min-h-10 px-4 py-3 text-black flex gap-1 justify-center shadow-2xl">
                                  <IoCloudUploadOutline className='text-2xl' />
                                  <p className='text-sm font-bold'>Upload</p>
                      </button>
                      <ConfirmModal
                          isOpen={open}
                          title="Uploading your post"
                          message="Are you sure to upload this post."
                          confirmText="Continue"
                          cancelText="Not Now"
                          onConfirm={uploadPost}
                          onCancel={() => setOpen(false)}
                          setOpen={setOpen}
                      />                
                  </div>
              </div>

            </div>
      </div>
      
    </div>
  )
}

export default Upload
