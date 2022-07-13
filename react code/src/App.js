import {useId, useState } from 'react';
import './loader.css'
import useSound from 'use-sound';

function App() {
  const [word,setWord] = useState("");
  const [meaning,setMeaning] = useState([]);
  const [input,setInput] = useState("")
  const [phonetics, setPhonetics] = useState({});
  const id = useId();
  const [isLoading,setIsLoading] = useState(0)
  const [error,setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    fetchData();
    setInput("")
  }
  const fetchData = async() => {
    try{
      setIsLoading(1)
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`)
      const result = await response.json();
      console.log(result[0])
      // find larger of the two array
      setPhonetics(result[0].phonetics[findLargerObject(result[0])]);
      setMeaning(result[0].meanings)
      setWord(result[0].word);
      setIsLoading(2)
    }catch(err){
      setError(input);
      setIsLoading(4);
    }
  }
  const findLargerObject = (result) => {
    let large = Object.keys(result.phonetics[0]).length;
    let largeIndex = 0;
    for(let i=1;i<result.phonetics.length;i++){
        if(Object.keys(result.phonetics[i]).length>large){
            largeIndex = i;
            large = Object.keys(result.phonetics[i]).length;
        }
    }
    return largeIndex;
  }

  return (
    <div>
      
      <header className='p-4 bg-dark sticky-top'>
        <div className=' container '>
          <div className='row'>
            <div className='col-md-2'></div>
            <form onSubmit={submit} className="col-md-8">
              <input type="text" className='form-control' value={input} onChange={(e)=>setInput(e.target.value)} placeholder='search' />
            </form>
        </div>
        </div>
      </header>

      <div className='container '>

        <div className='row p-4'>

          <div className='col-md-2'></div>

          {isLoading===0?<Welcome />
          :isLoading===1?<Loader />:
          isLoading===2?
          <div className='rounded-sm p-4 col-md-8'> 
            <div className='d-flex align-items-center justify-content-center'>
              <h2 className='font-weight-bolder text-capitalize mr-2'>{word && word}</h2> 
              <p className='align-self-end mr-2'>[ {phonetics && phonetics.text} ]</p>
              {phonetics.audio && <Audio url={phonetics.audio}/> }
            </div>
            <hr style={{border:'1px solid black'}}/>

              <ul className='list-group text-wrap '>
                {meaning.map((value,index)=>(
                  <li className='list-group-item mb-3' key={`${id}-${index}`}>
                    {/* {JSON.stringify(value,null,2)} */}
                    <h4><i>{value.partOfSpeech}</i></h4>
                    <ul className='list-group mt-1 border-0'>
                      {value.definitions.map((def,defIndex)=>(
                          <li className='list-group-item' key={`${id}-${defIndex}`}>
                            {def.definition && <><b style={{fontSize:'1.2rem'}}>definition</b> : {def.definition}<br/></>}
                            {def.synonyms.length>0?<><b style={{fontSize:'1.2rem'}}>synonyms</b> : {def.synonyms.join(', ')}<br/></>:null}
                            {def.antonyms.length>0?<><b style={{fontSize:'1.2rem'}}>antonyms</b> : {def.antonyms.join(', ')}<br/></>:null}
                            {def.example && <p className='text-secondary' style={{fontSize:'1rem'}}>&#x275B; {def.example} &#x275C;<br/></p>}
                          </li>
                      ))}
                    </ul>
                    {value.synonyms.length>0?<><b style={{fontSize:'1.2rem'}}>synonyms</b> : {value.synonyms.join(', ')}<br/></>:null}
                    {value.antonyms.length>0?<><b style={{fontSize:'1.2rem'}}>antonyms</b> : {value.antonyms.join(', ')}<br/></>:null}
                  </li>
                ))}
              </ul>

          </div>:<ShowError value={error}/>
          }

          {/* <pre>{data && JSON.stringify(data.meanings,null,2)}</pre> */}
          
        </div>

      </div>

    </div>/* end of top div */
  );
}

function Audio({url}) {
  const [play] = useSound(url);
  return (
      <button className='btn btn-dark btn-sm' onClick={play}>Play</button>
  );
}

function ShowError({value}) {
  return (
    <div className='col-md-12 bg-light jumbotron text-center'>
      <h2>Such word '{value}' doesn't exist.</h2>
    </div>
  );
}

function Welcome() {
  return (
    <div className='bg-light col-md-12 p-4 fluid text-center'>
      <h1 className='pb-1'>THE WORLD'S BEST DICTIONARY WEB APP</h1>
      <hr />
      <ul className='list-group text-left'>
        <li className='list-group-item bg-secondary text-white'><h4>Hello [ /həˈləʊ/ ]</h4></li>
        <li className='list-group-item'><i><h5>noun</h5></i></li>
        <li className='list-group-item'><b>definition</b> : "Hello!" or an equivalent greeting.</li>
        <li className='list-group-item'><b>synonyms</b> : greeting</li>
      </ul>
      <hr />
      <h4 className='mb-3'>Developer Links</h4>
      <div className='row'>
        <a href="https://www.facebook.com/kadum.komut.9" className='col-md-3 border bg-primary text-white p-3'>Facebook</a>
        <a href='https://github.com/komutkadum' className='col-md-3 border bg-secondary text-white p-3'>Github</a>
        <a href='kadumkomut2826@gmail.com' className='col-md-3 border bg-danger text-white p-3'>Google</a>
        <a href="https://www.instagram.com/kadumkomut______/" className='col-md-3 border bg-gradient-secondary text-white p-3' style={{background: 'radial-gradient(circle farthest-corner at 35% 90%, #fec564, transparent 50%), radial-gradient(circle farthest-corner at 0 140%, #fec564, transparent 50%), radial-gradient(ellipse farthest-corner at 0 -25%, #5258cf, transparent 50%), radial-gradient(ellipse farthest-corner at 20% -50%, #5258cf, transparent 50%), radial-gradient(ellipse farthest-corner at 100% 0, #893dc2, transparent 50%), radial-gradient(ellipse farthest-corner at 60% -20%, #893dc2, transparent 50%), radial-gradient(ellipse farthest-corner at 100% 100%, #d9317a, transparent), linear-gradient(#6559ca, #bc318f 30%, #e33f5f 50%, #f77638 70%, #fec66d 100%)'}}>Instagram</a>
      </div>
      <h4 className='mt-4'>Api used : <a href='https://dictionaryapi.dev/' >dictionaryapi</a></h4>
    </div>
  );
}

function Loader() {
  return (
    <div className='col-md-12' style={{display:'flex',justifyContent:'center',height:'50vh',alignItems:'center'}}>
      <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
    
  );
}


export default App;
