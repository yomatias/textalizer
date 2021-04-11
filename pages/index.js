import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Editor from '../components/Editor';
import { useState } from 'react';

export default function Home() {

  const [translation, setTranslation] = useState('');
  const [found, setFound] = useState([]);

  const [prepositions, setPrepositions] = useState(['a', 'ante', 'bajo', 'cabe', 'con', 'contra', 'de', 'desde', 'durante', 'en', 'entre', 'hacia', 'hasta', 'mediante', 'para', 'por', 'según', 'sin', 'so', 'sobre', 'tras', 'versus', 'vía', 'que']);

  const onUploadFile = (e) => {
    const file = e.target.files[0];
    const textType = /text.*/;

    if (file.type.match(textType)) {
      let reader = new FileReader();
      let updatedWords = [];

      reader.onload = function(e) {
        let content = reader.result;

        content = content.split('\n').map( (line) => `<p>${line}</p>`).join('\n');

        prepositions.forEach(word => {
          
          const formattedLine = ` <span id="${word}-mark" style="background-color: #ff5630; border-radius: 5px; color: #fff; padding-left: 3px; padding-right: 3px;">${word}</span>`
          const endOfLine = new RegExp(`\\s${word}\$`, 'gm');
          content = content.replaceAll(endOfLine, formattedLine);
          const previousToP = new RegExp(`\\s${word}</p>\$`, 'gm');
          content = content.replaceAll(previousToP, formattedLine);
          const previousToI = new RegExp(`\\s${word}</i>\$`, 'gm');
          content = content.replaceAll(previousToI, formattedLine);

          let total = 0;
          while(content.indexOf(`id="${word}-mark"`) >= 0) {
            total = total + 1;
            content = content.replace(`id="${word}-mark"`, `id="${word}-mark-${total}"`);
          }

          if(total > 0) {
            updatedWords.push({ text: word, total: total, current: 0 });
            setFound(updatedWords);
          }
        });
        
        setTranslation(content);
      }
   
      reader.readAsText(file);
    }
  }

  const getNextId = (current, total) => {
    let nextId = 0;
    if(current < total) {
      nextId = current + 1;
    } else {
      nextId = 1;
    }
    return nextId;
  }

  const scrollToElementByCodeAndId = (word, id) => {
		const highlightedElement = document.getElementById(`${word.text}-mark-${id}`);
		highlightedElement.scrollIntoView({block: "center"});

		let updatedFound = found;
		updatedFound.forEach(element => {
			if(element.text === word.text)
				element.current = id
		});
		setFound(updatedFound);
	}

  const scrollToNext = (word) => {
		const targetWord = found.filter(element => element.text === word)[0];
		let id = getNextId(targetWord.current, targetWord.total);
		scrollToElementByCodeAndId(targetWord, id);
	}

  return (
    <div className={styles.container}>

      <Head>
        <title>textalizer</title>
        <link rel="icon" href="/favicon.ico" />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" /> */}
      </Head>

      <div className={styles.navbar}>
        <div className={styles.addFileButtonContainer}>
          <label 
            className={styles.addFileButtonLabel}
            htmlFor="file_upload">+</label>
          <input 
            accept=".txt"
            className={styles.addFileButton}
            id="file_upload"
            type="file"
            onChange={ e => onUploadFile(e) } />
        </div>
      </div>

      <div className={styles.workspace}>
        <div className={styles.editor}>
          <Editor content={ translation } />
        </div>
        <div className={styles.tools}>
          <div className={styles.prepositions}>
            {
              prepositions.map((prep, index) => <span className={styles.prepositionChips} key={index}>{prep}</span>)
            }
          </div>
          <div className={styles.keyWords}>
            {
              found.map((word, index) => 
                <div 
                  key={index} 
                  onClick={ () => scrollToNext(word.text) }
                  className={styles.chip}>{ word.text }
                  <span className={styles.alert}>{ word.total }</span>
                </div>)
            }
          </div>
        </div>
      </div>
    </div>
  )
}
