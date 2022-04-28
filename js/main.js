let size = 0;

let maxCount = 0;

const $random = document.querySelector('#random');

const $inputsContainer = document.querySelector('.inputs-container');

const $inputsCount = document.querySelector('#inputs-count');

const $out = document.querySelector('#out');

const $showValues = document.querySelector('#show-values');

const $calculation = document.querySelector('#calculation');

const makeElement = (tag, className, childrens = []) => {

  const el = document.createElement(tag);

  el.className = className;

  el.append(...childrens);

  return el;

};

const makeInput = () => {

  const el = makeElement('input', 'input');

  el.type = 'text';

  return el;

};

const createElements = (count, constructor) => {

  return Array(count).fill().map(constructor);

};

const showInputsText = () => {

  const inputs = $inputsContainer.querySelectorAll('input');

  const values = [...inputs].reduce((acc, element) => {

    return `${acc} ${element.value}`;

  }, '');

  $out.textContent = values;

};

$showValues.addEventListener('click', showInputsText);

$random.addEventListener('click', () => {

  const count = parseInt($inputsCount.value);

  if (count > maxCount) {

    maxCount = count;

  }

  const inputs = createElements(count, makeInput);

  let $label = document.createElement("label");

  if (count !== 0) {

    $label.innerText = "G-(" + (size + 1) + ") = ";

  } else {

    $label.innerText = "G-(" + (size + 1) + ") = {нет вершин}";

  }

  size++;

  const $row = makeElement('div', 'mb-2', inputs);

  $inputsContainer.append($label, $row);

});


const getArray = () => {

  let arr1 = [];
  let array = [];

  const $mb2 = document.querySelectorAll('.mb-2');

  for (let i = 0; i < $mb2.length; i++) {

    const child = $mb2[i].childNodes;

    for (let j = 0; j < child.length; j++) {

      arr1.push(parseInt(child[j].value));

    }

    array.push(arr1);

    arr1 = [];

  }

  return array;
}

const calculat = () => {
  let array = getArray();
  let matrSmej = new Array(size);
  for (let i = 0; i < size; i++) {
    matrSmej[i] = new Array(size);
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      matrSmej[i][j] = 0;
    }
  }

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      matrSmej[array[i][j] - 1][i] = 1;
    }
  }

  let notUsedV = [];
  let topologiesArray = [];
  let reachabilityMatrix = getReachabilityMatrix(matrSmej);
  let sizeTopologiesArray = 0;

  console.log(reachabilityMatrix);

  for (let i = 0; i < matrSmej.length; i++) {
    notUsedV.push(i);
  }

  while (notUsedV.length !== 0) {
    let achievable = [];  //достяжимые R
    let contrAchievable = []; //контрдостяжимые Q

    for (let i = 0; i < reachabilityMatrix.length; i++) {
      for (let j = 0; j < notUsedV.length; j++) {
        if (i === notUsedV[j]) {
          if (reachabilityMatrix[notUsedV[0]][i] === 1) {
            achievable.push(i);
          }
          if (reachabilityMatrix[i][notUsedV[0]] === 1) {
            contrAchievable.push(i);
          }
        }
      }
    }
    let intersection = achievable.filter(value => contrAchievable.includes(value));
    topologiesArray[sizeTopologiesArray] = [];

    if (intersection.length !== 0) {

      topologiesArray[sizeTopologiesArray].push(intersection);
      console.log(intersection);

      for (let i = 0; i < intersection.length; i++) {
        let number = notUsedV.indexOf(intersection[i]);
        notUsedV.splice(number, 1);
      }

    } else {
      topologiesArray[sizeTopologiesArray].push(notUsedV[0]);
      notUsedV.splice(0, 1);
    }

    sizeTopologiesArray++;
  }


  let str1 = 'Топологическая декомпозиция' + '<br>';

  for (let i = 0; i < topologiesArray.length; i++) {

    str1 += 'Сильный связанный подграф (' + (i+1) + ')={';
    for (let j = 0; j < topologiesArray[i].length; j++) {
      if (j !== topologiesArray[i].length - 1) {
        str1 += (topologiesArray[i][j] + 1) + ',';
      } else str1 += (topologiesArray[i][j]);
    }

    str1 += '}' + '<br>';
  }

  str1 += '<br>';
  document.writeln(str1);

}


$calculation.addEventListener('click', calculat);


//взять матрицу достяимости
function getReachabilityMatrix(array) {
  let reachabilityMatrix = array;
  for (let k = 0; k < array.length; k++) {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length; j++) {
        if (array[i][j] === 0) {
          if (array[k][j] === 1 && array[i][k] === 1) {
            array[i][j] = 1;
          }
        }
      }
    }
  }
  return reachabilityMatrix;
}


//показать множиство левых инциденций
function showLeftIncidentMatrix(leftInc) {
  let str = 'Множество левых инциденций' + '<br>';

  for (let i = 0; i < leftInc.length; i++) {

    str += 'G+(' + (i + 1) + ')' + '={';

    if (leftInc[i].length === 0) {
      str += '';
    } else
      for (let j = 0; j < leftInc[i].length; j++) {
        if (leftInc[i][j] !== undefined) {
          if (j !== leftInc[i].length - 1) {
            str += (leftInc[i][j] + 1) + ',';
          } else str += (leftInc[i][j] + 1) + ')';
        }

      }
    str += "<br>";
  }
  document.writeln(str);
}

//показать множиство правых инциденций
function showRightIncidentMatrix(rightInc) {
  let str = 'Множество правых инциденций' + '<br>';

  for (let i = 0; i < rightInc.length; i++) {

    str += 'G+(' + (i + 1) + ')' + '={';

    if (rightInc[i].length === 0) {
      str += '';
    } else
      for (let j = 0; j < rightInc[i].length; j++) {
        if (rightInc[i][j] !== undefined) {
          if (j !== rightInc[i].length - 1) {
            str += (rightInc[i][j] + 1) + ',';
          } else str += (rightInc[i][j] + 1) + ')';
        }

      }
    str += "<br>";
  }
  document.writeln(str);
}

function  test(){

  let matrSmej = [
    [0,1,0,0,1,1,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0],
    [0,1,0,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0],
    [1,0,0,0,0,0,1,0,0,0],
    [0,0,0,0,1,0,0,1,0,1],
    [0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,1],
    [0,0,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,0,0,1,0,0]
  ];


  let notUsedV = [];
  let topologiesArray = [];
  let reachabilityMatrix = getReachabilityMatrix(matrSmej);
  let sizeTopologiesArray = 0;

  console.log(reachabilityMatrix);

  for (let i = 0; i < matrSmej.length; i++) {
    notUsedV.push(i);
  }

  while (notUsedV.length !== 0) {
    let achievable = [];  //достяжимые R
    let contrAchievable = []; //контрдостяжимые Q

    for (let i = 0; i < reachabilityMatrix.length; i++) {
      for(let j = 0; j < notUsedV.length; j++){
        if(i === notUsedV[j]){
          if (reachabilityMatrix[notUsedV[0]][i] === 1) {
            achievable.push(i);
          }
          if (reachabilityMatrix[i][notUsedV[0]] === 1) {
            contrAchievable.push(i);
          }
        }
      }
    }


    let intersection = achievable.filter(value => contrAchievable.includes(value));
    topologiesArray[sizeTopologiesArray] = [];

    if (intersection.length !== 0) {

      topologiesArray[sizeTopologiesArray].push(intersection);

      for (let i = 0; i < intersection.length; i++) {
        let number = notUsedV.indexOf(intersection[i]);
        notUsedV.splice(number, 1);
      }

    } else {
      topologiesArray[sizeTopologiesArray].push(notUsedV[0]);
      notUsedV.splice(0, 1);
    }

    sizeTopologiesArray++;

  }

  let str1 = 'Топологическая декомпозиция' + '<br>';

  for (let i = 0; i < topologiesArray.length; i++) {

    str1 += 'Сильный связанный подграф (' + (i+1) + ')={';
    for (let j = 0; j < topologiesArray[i].length; j++) {
      if (j !== topologiesArray[i].length - 1) {
        str1 += (topologiesArray[i][j] + 1) + ',';
      } else str1 += (topologiesArray[i][j] + 1);
    }

    str1 += '}' + '<br>';
  }

  str1 += '<br>';
  document.writeln(str1);


  let incMatrix = getTopologiesRightInc(matrSmej,topologiesArray);
  console.log(incMatrix);

}

function getTopologiesRightInc(matrSmej, topologiesArray) {
  let newArrayV = new Array(topologiesArray.length);
  for(let i = 0; i < topologiesArray.length; i++){
    newArrayV[i] = new Array(topologiesArray.length);
  }

  for (let i = 0; i < topologiesArray.length ; i++) {
    for (let j = 0; j < topologiesArray.length; j++) {
      newArrayV[i][j] = 0;
    }
  }

  let flag ;

  for (let i = 0; i < topologiesArray.length; i++) {
    for (let j = 0; j < topologiesArray[i].length; j++) {
      for(let k = 0; k < topologiesArray.length; k++){
        flag = 0;
        for(let n = 0; n < topologiesArray[k].length; n++){
          if (matrSmej[topologiesArray[i][j]][topologiesArray[i][j]] === 1 && i !== k) {
            newArrayV[i][k] = 1;
            flag = 1;
            break;
          }
        }
        if(flag === 1){
          break;
        }
      }
    }
  }

  return newArrayV;
}





