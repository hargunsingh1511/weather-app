const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorScreen=document.querySelector(".not-found");
const api_key="0a5833348e470eeb7b3b1f9efbbdb797";

let curretTab=userTab;
curretTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab !=curretTab){
        curretTab.classList.remove("current-tab");
        curretTab=clickedTab;
        curretTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            errorScreen.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}
function getfromSessionStorage(){
    const localCordinates=sessionStorage.getItem("user-coardinates");
    if(!localCordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coardinates =JSON.parse(localCordinates);
        fetchUserWheatherInfo(coardinates);
    }
}
async function fetchUserWheatherInfo(coardinates){
    const{lat,lon}=coardinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // <!--api call-->
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
          );
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWheatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
    }
}
function renderWheatherInfo(weatherInfo){
    const cityName=document.querySelector("[data-cityname]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const wheatherIcon=document.querySelector("[data-wheatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    cityName.innerText=weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    wheatherIcon.src= `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText =  `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}
userTab.addEventListener("click",()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{

    }
}
function showPosition(position){
    const userCoardinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coardinates",JSON.stringify(userCoardinates));
    fetchUserWheatherInfo(userCoardinates);
}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation());

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchInput.value===""){
        return;
    }
    else{
        fetchSearchWheatherInfo(searchInput.value);
    }
    
});


async function fetchSearchWheatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    errorScreen.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`);
            const data= await response.json();
            if (!data.sys) {
                throw data;
              }
            
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWheatherInfo(data);
           
       
    }
    catch(err){
        errorScreen.classList.add("active");
        loadingScreen.classList.remove("active");
    }
    

}