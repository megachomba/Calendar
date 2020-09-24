import React, {useState, useEffect} from 'react';
import './App.css';
import {biens} from "./data";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin  from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import { Dispo, Bien, Visite } from './interfaces';

interface selectedDates {
  start: Date,
  end: Date,
  display: String
};



function App() {
  const [data, setData]= useState(biens)
  const [selectedDates, setSelectedDates]= useState<selectedDates[]>()
  const [selectedBien, setSelectedBien] = useState(biens[0])
  const [state,setState] = useState("view")
  const [visites ,setVisites] = useState<Visite[]>()
 
  let dispos: any[] = data.filter(e => {return e.id == selectedBien.id})[0].disponibilite.map(dispo => {
    return {
      //title: bien.id,
      //groupId: 'testGroupId',
      start: dispo.start,
      end: dispo.end,
      display: state=="view" ? "inverse-background" : "background"
    }
  })
  const handleSelect = (e:any) => {
    if (state=="modify") {
        console.log(e)
        const newElement : selectedDates = {
          start: e.start,
          end: e.end,
          display: "background",
        }
        selectedDates ? setSelectedDates(selectedDates.concat(newElement)) : setSelectedDates([newElement])
      }
    }
  const handleSave = (e:any) => {
    // logique pour enregistrer les donnes
    if (selectedDates) {
      const newArray : Dispo[]= selectedDates.map(item => {
        return {
        end: item.end,
        start: item.start,
        recurrent: true,
        }
      })
      data.filter(e => {return e.id == selectedBien.id})[0].disponibilite= newArray
      
      setData(data)
    }

  }
  const handleSelectBien = (bien:Bien) => {
    setSelectedBien(bien)
    if(selectedDates){
      setSelectedDates(dispos)
    }
  }
  const handleDateClick= (e:any) => {
    console.log("clicked", selectedBien.addresse)
    const myVisit:Visite = {
      bienId: selectedBien.addresse,
      date:e.date
    }
    visites ? setVisites(visites.concat(myVisit)) : setVisites([myVisit])
  }
  useEffect(() => {
    setSelectedDates(undefined)
    
  },[selectedBien]);
  useEffect(() => {
    if (state=="modify"){
      setSelectedDates(dispos)
      console.log("in the use effect i have")
    }
  },[state]);

  const getDispos = () => {
    if ( state=="view") {
      return dispos
    }else{
      return selectedDates
    }
  }
  const getVisites = () => {
    if (visites){
      const result = visites.filter(e => {return e.bienId == selectedBien.addresse}).map(visite => {
        return {
          title: visite.bienId,
          start: visite.date,
        }
      })
      return result
    }
  }
  return (
  <>
    <button
      onClick={() => state=="view" ? setState("modify") : setState("view") }>
        {state=="view" ? "modifier le planning" : "voir le planning"}
    </button>
    <button
      onClick={e => handleSave(e)}>
        save
      </button>
      {data.map(bien =>
        <button
        onClick={e => handleSelectBien(bien)}>
          {bien.addresse}
        </button>
        )}
      <FullCalendar
        plugins={[ timeGridPlugin, interactionPlugin  ]}
        initialDate= '2020-09-14'
        initialView="timeGridWeek"
        editable={true}
        //events={state=="view" ? dispos : selectedDates}
        //@ts-ignore
        eventSources= {[getDispos(), getVisites()]}
        selectable={true}
        selectOverlap={false}
        dateClick ={e=> handleDateClick(e)}
        select={e => handleSelect(e)}
      />
      {console.log("my events",dispos)}
      {}
      {console.log("selectedDates",selectedDates)}
      {console.log("selectebien",selectedBien)}
  </>
  );
}

export default App;
