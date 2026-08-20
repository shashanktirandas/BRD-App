import React, {
    useContext,
    useEffect,
    useState
} from 'react'
import ProfileNavbar from '../components/ProfileNavbar';
import { MdAutoGraph, MdOutlineUpdate } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { GiGrowth } from 'react-icons/gi';
import { GrGrow } from 'react-icons/gr';
import ConfirmModal from '../components/ConfirmModal';
import AppContext from '../context/AppContext';
import OtpModal from '../components/OtpModal';
import { profile_transform } from '../services/userService';
import cameras from "../data/cameras";
import {
    getCountries,
    getStates,
    getCities
} from "../services/locationService";

const Profile_transform = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState(``);
  const [experience, setExperience] = useState(``);
  const [camera, setCamera] = useState('');
  const [cameraModel, setCameraModel] = useState(``);
  const [cameraSearch, setCameraSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [mainLens, setMainLens] = useState('');
  const [zoomLens, setZoomLens] = useState('');
  const [instagram, setInstagram] = useState(``);
  const [website, setWebsite] = useState('');
  const [youtube, setYoutube] = useState('');
  const [country, setCountry] = useState('');
  const [state, setStatename] = useState('');
  const [city, setCity] = useState('');
  const navigate=useNavigate();
  const [open, setOpen] = useState(false);
  const { fetchProfile, setToken } = useContext(AppContext);
  const [openOtp, setOpenOtp] = useState(false)
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);

  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [cameraPreview, setCameraPreview] = useState(null);

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);


  const selectedCamera = cameras.find(
        (item) => item.brand === camera
    );

    const cameraBrands = cameras.map(
        (item) => item.brand
    );

    const cameraModels = selectedCamera?.models || [];

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

    const [specializationInput, setSpecializationInput] = useState('');

    const [specializations, setSpecializations] = useState([]);

    const addSpecialization = () => {

        let tag = specializationInput.trim();

        if (!tag) return;

        // Remove # if user typed it
        tag = tag.replace(/^#+/, '');

        // Normalize
        tag = tag.trim();

        if (!tag) return;

        // Maximum 5 tags
        if (specializations.length >= 5) {
            alert("You can add up to 5 specializations.");
            return;
        }

        // Prevent duplicates
        const alreadyExists = specializations.some(
            (item) => item.toLowerCase() === tag.toLowerCase()
        );

        if (alreadyExists) {
            alert("This specialization is already added.");
            return;
        }

        setSpecializations([
            ...specializations,
            tag
        ]);

        // Clear input
        setSpecializationInput('');
    };
    const handleSpecializationKeyDown = (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            addSpecialization();

        }
    };
    const removeSpecialization = (tagToRemove) => {

        setSpecializations(
            specializations.filter(
                (tag) => tag !== tagToRemove
            )
        );

    };
    function becomeCreator() {
          console.log("Transform to creator");
          setOpen(false);
          setOpenOtp(true);
    }
    const validateCreatorForm = () => {

        if (!name.trim()) {
            alert("Please enter your creator name.");
            return false;
        }

        if (!profileImage) {
            alert("Please select your profile photo.");
            return false;
        }

        if (!coverImage) {
            alert("Please select your cover photo.");
            return false;
        }

        if (!cameraImage) {
            alert("Please select your camera photo.");
            return false;
        }

        if (!country.trim()) {
            alert("Please enter your country.");
            return false;
        }

        if (!state.trim()) {
            alert("Please enter your state.");
            return false;
        }

        if (!city.trim()) {
            alert("Please enter your city.");
            return false;
        }

        if (!camera.trim()) {
            alert("Please enter your camera brand.");
            return false;
        }

        if (!cameraModel.trim()) {
            alert("Please enter your camera model.");
            return false;
        }

        if (!experience.trim()) {
            alert("Please select your experience.");
            return false;
        }

        return true;
    };
   
    const handleImage = (event, type) => {

        const file = event.target.files[0];

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
        }

        if (type === "cover") {
            setCoverImage(file);
            setCoverPreview(preview);
        }

        if (type === "camera") {
            setCameraImage(file);
            setCameraPreview(preview);
        }
    };
    const creatorTransform = async () => {

        try {

            if (!profileImage) {
                alert("Please select a profile photo.");
                return;
            }

            if (!coverImage) {
                alert("Please select a cover photo.");
                return;
            }

            if (!cameraImage) {
                alert("Please select a camera photo.");
                return;
            }

            const formData = new FormData();

            // Images
            formData.append("profileImage", profileImage);
            formData.append("coverImage", coverImage);
            formData.append("cameraImage", cameraImage);

            // Creator information
            formData.append("displayName", name);
            formData.append("bio", bio);
            formData.append("country", country);
            formData.append("state", state);
            formData.append("city", city);
            formData.append("experience", experience);

            // Camera information
            formData.append("cameraBrand", camera);
            formData.append("cameraModel", cameraModel);
            formData.append("mainLens", mainLens);
            formData.append("zoomLens", zoomLens);

            // Social links
            formData.append("instagram", instagram);
            formData.append("website", website);
            formData.append("youtube", youtube);

            // Specialization
            formData.append(
                "specialization",
                JSON.stringify(specializations)
            );

            formData.append("isVerified", "false");

            const response = await profile_transform(formData);

            const newToken = response.data?.data?.token;

            if (!newToken) {
                throw new Error("Creator registration succeeded but no new token was returned.");
            }

            localStorage.setItem("token", newToken);
            setToken(newToken);

            setOpenOtp(false);

            await fetchProfile();

            alert("Transformed to creator successfully");

            navigate("/");

        } catch (err) {

            console.log(
                err.response?.data || err
            );

        }
    };

    useEffect(() => {

        const loadCountries = async () => {

            try {

                setLoadingCountries(true);

                const response = await getCountries();
                console.log(response);
                
                setCountries(response.data.data || []);

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
            setCities([]);
            return;
        }

        const loadStates = async () => {

            try {

                setLoadingStates(true);

                setStatename("");
                setCity("");
                setCities([]);

                const response = await getStates(country);

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

                setCity("");

                const response = await getCities(
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
                              Creator info  
                      </div>
                      {/* PROFILE IMAGE */}
                      <div className="text-start w-full rounded-xl bg-gray-100 px-4 py-3 text-black">

                          <h2 className="text-[12px] font-semibold text-gray-400 mb-2">
                              PROFILE PHOTO
                          </h2>

                          <label
                              htmlFor="profileImage"
                              className="w-full h-40 bg-white rounded-xl flex justify-center items-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 overflow-hidden"
                          >

                              {profilePreview ? (
                                  <img
                                      src={profilePreview}
                                      alt="Profile preview"
                                      className="w-full h-full object-cover"
                                  />
                              ) : (
                                  <span className="text-sm text-gray-400">
                                      Select profile photo
                                  </span>
                              )}

                          </label>

                          <input
                              id="profileImage"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImage(e, "profile")}
                          />

                      </div>


                      {/* COVER IMAGE */}
                      <div className="text-start w-full rounded-xl bg-gray-100 px-4 py-3 text-black">

                          <h2 className="text-[12px] font-semibold text-gray-400 mb-2">
                              COVER PHOTO
                          </h2>

                          <label
                              htmlFor="coverImage"
                              className="w-full h-40 bg-white rounded-xl flex justify-center items-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 overflow-hidden"
                          >

                              {coverPreview ? (
                                  <img
                                      src={coverPreview}
                                      alt="Cover preview"
                                      className="w-full h-full object-cover"
                                  />
                              ) : (
                                  <span className="text-sm text-gray-400">
                                      Select cover photo
                                  </span>
                              )}

                          </label>

                          <input
                              id="coverImage"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImage(e, "cover")}
                          />

                      </div>


                      
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                                              <div className=" h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400'>CREATOR NAME</h2>
                                                <input className="w-full bg-white rounded-xl text-md px-5 py-3"
                                                placeholder='Enter your name' 
                                                value={name} 
                                                onChange={(e) => setName(e.target.value)}
                                                type="text"/>
                                              </div>
                      </div>
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                                              <div className=" h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400 uppercase'> BIO</h2>
                                                <textarea className="w-full min-h-30 bg-white rounded-xl text-md px-5 py-3"
                                                placeholder='Write your bio' 
                                                value={bio} 
                                                onChange={(e) => setBio(e.target.value)}
                                                />
                                              </div>
                      </div>
                    <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                        <div className="h-full flex flex-col justify-between gap-2">

                            <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
                                EXPERIENCE
                            </h2>

                            <select
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none cursor-pointer"
                            >

                                <option value="" disabled>
                                    Select your experience
                                </option>

                                <option value="Beginner">
                                    Beginner
                                </option>

                                <option value="Intermediate">
                                    Intermediate
                                </option>

                                <option value="Professional">
                                    Professional
                                </option>

                            </select>

                        </div>
                    </div>
                      {/* CAMERA IMAGE */}
                      <div className="text-start w-full rounded-xl bg-gray-100 px-4 py-3 text-black">

                          <h2 className="text-[12px] font-semibold text-gray-400 mb-2">
                              CAMERA PHOTO
                          </h2>

                          <label
                              htmlFor="cameraImage"
                              className="w-full h-40 bg-white rounded-xl flex justify-center items-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 overflow-hidden"
                          >

                              {cameraPreview ? (
                                  <img
                                      src={cameraPreview}
                                      alt="Camera preview"
                                      className="w-full h-full object-cover"
                                  />
                              ) : (
                                  <span className="text-sm text-gray-400">
                                      Select camera photo
                                  </span>
                              )}

                          </label>

                          <input
                              id="cameraImage"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImage(e, "camera")}
                          />

                      </div> 
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">

                        <div className="flex flex-col gap-2">

                            <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
                                CAMERA BRAND
                            </h2>

                            <select
                                value={camera}
                                onChange={(e) => {
                                    setCamera(e.target.value);
                                    setCameraModel("");
                                    setModelSearch("");
                                }}
                                className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none cursor-pointer"
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
                                    onChange={(e) => setCameraModel(e.target.value)}
                                    disabled={!camera}
                                    className={`w-full bg-white rounded-xl text-md px-5 py-3 outline-none ${
                                        !camera
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "cursor-pointer"
                                    }`}
                                >

                                    <option value="" disabled>
                                        {camera
                                            ? "Select camera model"
                                            : "Select camera brand first"}
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
                      <div className="text-start w-full rounded-xl bg-gray-100 px-4 py-3 text-black">

                            <div className="flex flex-col gap-3">

                                <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
                                    MAIN LENS
                                </h2>

                                <input
                                    type="text"
                                    value={mainLens}
                                    onChange={(e) => setMainLens(e.target.value)}
                                    placeholder="e.g. 100-400mm f/4.5-5.6"
                                    className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none"
                                />

                                <div className="flex flex-wrap gap-2">

                                    {popularLenses.slice(0, 5).map((lens) => (

                                        <button
                                            key={lens}
                                            type="button"
                                            onClick={() => setMainLens(lens)}
                                            className="px-3 py-1.5 rounded-full bg-white text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            {lens}
                                        </button>

                                    ))}

                                </div>

                            </div>

                      </div>
                      <div className="text-start w-full rounded-xl bg-gray-100 px-4 py-3 text-black">

                            <div className="flex flex-col gap-3">

                                <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
                                    ZOOM LENS
                                </h2>

                                <input
                                    type="text"
                                    value={zoomLens}
                                    onChange={(e) => setZoomLens(e.target.value)}
                                    placeholder="e.g. 200-600mm f/5.6-6.3"
                                    className="w-full bg-white rounded-xl text-md px-5 py-3 outline-none"
                                />
                                
                                <div className="flex flex-wrap gap-2">

                                    {popularLenses
                                        .filter((lens) => lens.includes("-"))
                                        .map((lens) => (

                                            <button
                                                key={lens}
                                                type="button"
                                                onClick={() => setZoomLens(lens)}
                                                className="px-3 py-1.5 rounded-full bg-white text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                {lens}
                                            </button>

                                        ))}
                                    <button
                                        type="button"
                                        onClick={() => setZoomLens("None")}
                                        className="px-3 py-1.5 rounded-full bg-white text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        No zoom lens
                                    </button>

                                </div>

                            </div>

                      </div>
                      <div className="text-start w-full rounded-xl bg-gray-100 px-4 py-3 text-black">

                            <div className="flex flex-col gap-3">

                                <div className="flex items-center justify-between">

                                    <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
                                        SPECIALIZATIONS
                                    </h2>

                                    <span className="text-[11px] text-gray-400">
                                        {specializations.length}/5
                                    </span>

                                </div>


                                {/* Added Tags */}

                                {specializations.length > 0 && (

                                    <div className="flex flex-wrap gap-2">

                                        {specializations.map((tag) => (

                                            <div
                                                key={tag}
                                                className="flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-3 py-1.5 text-sm"
                                            >

                                                <span>
                                                    #{tag}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => removeSpecialization(tag)}
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
                                        value={specializationInput}
                                        onChange={(e) =>
                                            setSpecializationInput(e.target.value)
                                        }
                                        onKeyDown={handleSpecializationKeyDown}
                                        placeholder="#birdphotography"
                                        className="flex-1 bg-white rounded-xl text-md px-5 py-3 outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={addSpecialization}
                                        className="px-5 rounded-xl bg-blue-500 text-white font-semibold"
                                    >
                                        Add
                                    </button>

                                </div>

                                <p className="text-[11px] text-gray-400">
                                    Add up to 5 photography specializations. Press Enter to add.
                                </p>

                            </div>

                      </div>
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                                              <div className=" h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400 uppercase'>instagram</h2>
                                                <input className="w-full bg-white rounded-xl text-md px-5 py-3"
                                                placeholder='Enter your instagram' 
                                                value={instagram} 
                                                onChange={(e) => setInstagram(e.target.value)}
                                                type="text"/>
                                              </div>
                      </div>
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                                              <div className=" h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400 uppercase'>website</h2>
                                                <input className="w-full bg-white rounded-xl text-md px-5 py-3"
                                                placeholder='Enter your website' 
                                                value={website} 
                                                onChange={(e) => setWebsite(e.target.value)}
                                                type="text"/>
                                              </div>
                      </div>
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                                              <div className=" h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400 uppercase'>youtube</h2>
                                                <input className="w-full bg-white rounded-xl text-md px-5 py-3"
                                                placeholder='Enter your youtube' 
                                                value={youtube} 
                                                onChange={(e) => setYoutube(e.target.value)}
                                                type="text"/>
                                              </div>
                      </div>
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">

                            <div className="flex flex-col gap-2">

                                <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
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

                            <div className="flex flex-col gap-2">

                                <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
                                    STATE
                                </h2>

                                <select
                                    value={state}
                                    onChange={(e) => setStatename(e.target.value)}
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

                                    {states.map((stateItem) => (

                                        <option
                                            key={stateItem.state_code}
                                            value={stateItem.name}
                                        >
                                            {stateItem.name}
                                        </option>

                                    ))}
                                </select>

                            </div>

                      </div>
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">

                            <div className="flex flex-col gap-2">

                                <h2 className="text-[12px] font-semibold text-gray-400 uppercase">
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
                      

                      <button onClick={() => {
                                              if (validateCreatorForm()) {
                                                  setOpen(true);
                                              }
                                          }} style={{backgroundColor:'#3d84cd'}}  className="w-full rounded-xl min-h-10 px-4 py-3 text-black flex gap-1 justify-center shadow-2xl">
                                  <MdAutoGraph className='text-2xl' />
                                  <p className='text-sm font-bold'>Transform</p>
                      </button>
                      <ConfirmModal
                          isOpen={open}
                          title="Become Creator"
                          message="You can start selling your artwork after approval."
                          confirmText="Continue"
                          cancelText="Not Now"
                          onConfirm={becomeCreator}
                          onCancel={() => setOpen(false)}
                          setOpen={setOpen}
                      />
                      <OtpModal
                        isOpen={openOtp}
                        title="Verify OTP"
                        message="Enter the OTP sent to your registered email."
                        confirmText="Verify OTP"
                        cancelText="Cancel"
                        purpose="profile-transform"
                        onConfirm={creatorTransform}
                        onCancel={() => setOpenOtp(false)}
                        setOpen={setOpenOtp}
                    />                
                  </div>
              </div>

            </div>
      </div>
    </div>
  )
}

export default Profile_transform
