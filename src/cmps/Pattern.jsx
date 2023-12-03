import PatternContext from '../context/PatternContext'
import PatternContextProvider from "../context/PatternContextProvider.jsx";
import InstrumentRack from "./InstrumentRack";
import Beat from "./Beat";
import {useContext, useState, useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";

export default function Pattern({index}) {
  
  const pattern = useSelector(state => state.player.patterns[index])


    
  return (
    <PatternContextProvider index={index}>
      {/* <InstrumentPicker /> */}
      <div className="flex max-w-3xl mx-auto mt-6">
        <InstrumentRack />
        <Measure/>
      </div>
    </PatternContextProvider>
  );
}


function Measure() {
    const {pattern} = useContext(PatternContext)

    return (
        <>
        {pattern.beats.map((beat) => (
            <Beat beat={beat}/>
        ))}
        </>
    )
}