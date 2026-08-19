import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProfileNavbar from '../components/ProfileNavbar';
import { IoCloudUploadOutline } from 'react-icons/io5';
import ConfirmModal from '../components/ConfirmModal';
import { MdOutlineUpdate } from 'react-icons/md';
import AppContext from '../context/AppContext';
import { creator_getsinglepost, creator_update_post } from '../services/creatorService';
import cameras from "../data/cameras";
import {
    getCountries,
    getStates,
    getCities
} from "../services/locationService";

const Edit_post = () => {
  
    const {id}=useParams();
    const {posts,post,setPost,fetchPosts,fetchCreatorPosts}=useContext(AppContext);
    const [open, setOpen] = useState(false)
    const navigate=useNavigate();

    const [birdName, setbirdName] = useState('');
    const [scientificName, setscientificName] = useState('');
    const [discription, setDiscription] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [cameraBrand, setCameraBrand] = useState('');
    const [cameraModel, setCameraModel] = useState('');
    const [lens, setLens] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    const selectedCamera = cameras.find(
        item => item.brand === cameraBrand
    );

    const cameraBrands = cameras.map(
        item => item.brand
    );

    const cameraModels =
        selectedCamera?.models || [];
      const fetchPost = async () =>{
                          try {           
                                  const response = await creator_getsinglepost(id);
                                  //console.log(response.data.data.post);
                                  console.log('loading...')
                                  if (response?.data?.data?.post) {
                                      setPost(response.data.data.post);
                                  } else {
                                      setPost(null);
                                  }
                                  
                          } catch (err) {
                              console.log(err);
                              navigate('/creator');
                          }
                       
            }
              useEffect(() => {
                      fetchPost();
              }, []);

              useEffect(() => {
                            if (!post) return;
      
                            setbirdName(post.birdName || "");
                            setscientificName(post.scientificName || "");
                            setDiscription(post.description || "");
                            setCameraBrand(post.cameraBrand || "");
                            setCameraModel(post.cameraModel || "");
                            setCountry(post.country || "");
                            setState(post.state || "");
                            setCity(post.city || "");
                            setLens(post.lens || "");
                            setTags(post.tags || []);
                        }, [post]);
    const addTag = () => {

        let tag = tagInput.trim();

        if (!tag) return;

        tag = tag.replace(/^#+/, "").trim();

        if (!tag) return;

        if (tags.length >= 5) {
            alert("You can add up to 5 tags.");
            return;
        }

        const exists = tags.some(
            item => item.toLowerCase() === tag.toLowerCase()
        );

        if (exists) {
            alert("This tag is already added.");
            return;
        }

        setTags(prev => [...prev, tag]);

        setTagInput("");
    };


    const removeTag = (tagToRemove) => {

        setTags(prev =>
            prev.filter(tag => tag !== tagToRemove)
        );

    };


    const handleTagKeyDown = (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            addTag();

        }

    };
    const hasPostChanges = () => {

    const originalTags = post?.tags || [];

    const currentTags = tags || [];

    const tagsChanged =
        JSON.stringify(originalTags) !==
        JSON.stringify(currentTags);

    return (
        birdName !== (post?.birdName || "") ||
        scientificName !== (post?.scientificName || "") ||
        discription !== (post?.description || "") ||
        cameraBrand !== (post?.cameraBrand || "") ||
        cameraModel !== (post?.cameraModel || "") ||
        lens !== (post?.lens || "") ||
        country !== (post?.country || "") ||
        state !== (post?.state || "") ||
        city !== (post?.city || "") ||
        tagsChanged
    );
};
    const updatePost = async () => {

    try {

        const postData = {
            birdName,
            scientificName,
            description: discription,
            tags,
            cameraBrand,
            cameraModel,
            lens,
            country,
            state,
            city
        };

        console.log("UPDATING POST:", postData);

        const response = await creator_update_post(
            id,
            postData
        );

        console.log(
            "POST UPDATED:",
            response.data
        );

        setOpen(false);

        await fetchPost();

        alert("Post updated successfully.");

    } catch (error) {

        console.error(
            "UPDATE POST ERROR:",
            error.response?.data || error
        );

    }
};
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
                  "Failed to load countries:",
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
          return;
      }

      const loadStates = async () => {

          try {

              setLoadingStates(true);

              const response =
                  await getStates(country);

              setStates(
                  response.data.data || []
              );

          } catch (error) {

              console.error(
                  "Failed to load states:",
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
                  "Failed to load cities:",
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
                                Post edit 
                        </div> 
                        <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                                                <div className=" h-full flex flex-col justify-between  gap-2">
                                                  <h2 className='text-[12px]  font-semibold text-gray-400'>Title</h2>
                                                  <input className="w-full bg-white rounded-xl text-md px-5 py-3"
                                                  placeholder='Enter post title' 
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
                                                  <textarea className="w-full min-h-40 bg-white rounded-xl text-md px-5 py-3"
                                                  placeholder='Enter post discription' 
                                                  value={discription} 
                                                  onChange={(e) => setDiscription(e.target.value)}
                                                  />
                                                </div>
                        </div> 
                        <div className="text-start w-full rounded-xl bg-gray-100 px-4 py-3 text-black">

                            <div className="flex flex-col gap-3">

                                <div className="flex items-center justify-between">

                                    <h2 className="text-[12px] font-semibold text-gray-400">
                                        TAGS
                                    </h2>

                                    <span className="text-[11px] text-gray-400">
                                        {tags.length}/5
                                    </span>

                                </div>

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

                                <div className="flex gap-2">

                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) =>
                                            setTagInput(e.target.value)
                                        }
                                        onKeyDown={handleTagKeyDown}
                                        placeholder="#birdphotography"
                                        className="flex-1 bg-white rounded-xl px-5 py-3 outline-none"
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
                                              <div className=" h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400'>MAIN LENS</h2>
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
                                                            type="button"
                                                            key={item}
                                                            onClick={() => setLens(item)}
                                                            className="px-3 py-1.5 rounded-full bg-white text-xs text-gray-600"
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
                                    onChange={(e) => {
                                        setCountry(e.target.value);
                                        setState("");
                                        setCity("");
                                    }}
                                    disabled={loadingCountries}
                                    className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none"
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
                                    onChange={(e) => {
                                        setState(e.target.value);
                                        setCity("");
                                    }}
                                    disabled={!country || loadingStates}
                                    className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none"
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
                                    onChange={(e) =>
                                        setCity(e.target.value)
                                    }
                                    disabled={!state || loadingCities}
                                    className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none"
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
                        
  
                        <button onClick={() => {

                                      if (!hasPostChanges()) {

                                          alert("No changes to update.");

                                          return;
                                      }

                                      setOpen(true);

                                  }}
                              style={{backgroundColor:'#3d84cd'}}  className="w-full rounded-xl min-h-10 px-4 py-3 text-black flex gap-1 justify-center shadow-2xl">
                                    <MdOutlineUpdate className='text-2xl' />
                                    <p className='text-sm font-bold'>Update</p>
                        </button>
                        <ConfirmModal
                            isOpen={open}
                            title="Uploading your post"
                            message="Are you sure to upload this post."
                            confirmText="Continue"
                            cancelText="Not Now"
                            onConfirm={updatePost}
                            onCancel={() => setOpen(false)}
                            setOpen={setOpen}
                        />                
                    </div>
                </div>
  
              </div>
        
        <div className="text-6xl font-bold text-center">Post Upload page</div>
              <div className="m-6 w-full flex justify-center gap-2">
              <Link to={'/search'}>Search</Link>
              <Link to={'/profile'}>Profile</Link>
              <Link to={'/signup'}>Signup</Link>
            </div>
        </div>
        <div className=""></div>
      </div>
    )
}

export default Edit_post 
