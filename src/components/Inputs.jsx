import React, { useState } from 'react';
import { UilSearch, UilLocationPinAlt } from '@iconscout/react-unicons';
import { toast } from 'react-toastify';


function Inputs({ setQuery, units, setUnits }) {
    const [city, setCity] = useState('');

    const handleClickUnits = (e) => {
        const selectedUnit = e.currentTarget.name
        if (units !== selectedUnit) setUnits(selectedUnit)
    }

    const handleSearchClick = () => {
        if (city !== '') setQuery({ q: city })
    };

    const hanldeEnterPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    }

    const handleLocationClick = () => {
        if (navigator.geolocation) {

            toast.info('Fetching user location')

            navigator.geolocation.getCurrentPosition((position) => {
                let lat = position.coords.latitude
                let lon = position.coords.longitude

            toast.success('Location fetched!')

                setQuery({
                    lat,
                    lon
                })
            })
        }
    }

  return (
    <div className='flex flex-row justify-center my-6'>
        <div className='flex flex-row w-3/4 items-center justify-center space-x-4'>
            <input
                value={city}
                onChange={(e) => setCity(e.currentTarget.value)}
                type='text'
                className='text-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize placeholder:lowercase' 
                placeholder='Search for city ...'
                onKeyDown={hanldeEnterPress}  
            />
            <UilSearch 
                size={25} 
                className='text-white cursor-pointer transition ease-out hover:scale-125'
                onClick={handleSearchClick}
            />
            <UilLocationPinAlt 
                size={25} 
                className='text-white cursor-pointer transition ease-out hover:scale-125'
                onClick={handleLocationClick}
            />
        </div>
        <div className='flex flex-grow w-1/4 items-center justify-center'>
            <button 
                name='metric' 
                className='text-xl text-white font-light transition ease-out hover:scale-125'
                onClick={handleClickUnits}
            >&#176;C</button>
            <p className='text-xl text-white mx-1'>|</p>
            <button 
                name='imperial' 
                className='text-xl text-white font-light transition ease-out hover:scale-125'
                onClick={handleClickUnits}
            >&#176;F</button>
        </div>
    </div>
  )
}

export default Inputs
