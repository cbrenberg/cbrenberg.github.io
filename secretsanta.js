const people = [
  {
    "ID": 1,
    "name": "Sarah",
    "partnerID": 2
  },
  {
    "ID": 2,
    "name": "Alex",
    "partnerID": 1
  },
  {
    "ID": 3,
    "name": "Laura",
    "partnerID": 4
  },
  {
    "ID": 4,
    "name": "Sean",
    "partnerID": 3
  },
  {
    "ID": 5,
    "name": "Kari",
    "partnerID": 6
  },
  {
    "ID": 6,
    "name": "Karly",
    "partnerID": 5
  },
  {
    "ID": 7,
    "name": "Chris",
    "partnerID": null
  }
];

class Person {
  constructor(ID, name, partnerID) {
    this.ID = ID;
    this.name = name;
    this.partnerID = partnerID;
    this.giftRecipientID = null;
  }

  getID() {
    return this.ID;
  }
}

function initializeGivers(people) {
  let givers = [];
  for (let person of people) {
    givers.push(new Person(person.ID, person.name, person.partnerID));
  }
  return givers;
}

function getRandomRecipients(unrandomizedPeopleArray) {
  let recipients = [...unrandomizedPeopleArray];
  return randomizeArrayOrder(recipients);
}

function randomizeArrayOrder(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function assignRandomPartners(listOfPeople) {
  let shuffledPeople = randomizeArrayOrder([...listOfPeople]);
  let halfwayRoundedDown = Math.floor(shuffledPeople.length / 2);
  for (let i = 0; i < halfwayRoundedDown; i++) {
    let partnerOne = shuffledPeople[i];
    let partnerTwo = shuffledPeople[shuffledPeople.length - i - 1];
    partnerOne.partnerID = partnerTwo.ID;
    partnerTwo.partnerID = partnerOne.ID;
  }
}

function arePartnersOrSamePerson(giver, recipient) {
  return (arePartners(giver, recipient) || areSamePerson(giver, recipient));
}

function arePartners(giver, recipient) {
  return (giver.ID === recipient.partnerID || giver.partnerID === recipient.ID);
}

function areSamePerson(giver, recipient) {
  return giver.ID === recipient.ID;
}

function findIndexOfFirstEligibleRecipientOrNull(giver, recipientsArray) {
  for (let recipient of recipientsArray) {
    if (!arePartnersOrSamePerson(giver, recipient)) {
      return recipientsArray.indexOf(recipient);
    }
  }
  return null;
}

function assignRecipientsToGivers(givers, recipients) {
  try {
    let originalRecipients = [...recipients];
    randomizeArrayOrder(givers);
    for (let i = 0; i < givers.length; i++) {
      randomizeArrayOrder(recipients);
      let recipientIndex = findIndexOfFirstEligibleRecipientOrNull(givers[i], recipients);
      if (recipientIndex != null && recipientIndex < recipients.length) {
        givers[i].giftRecipientID = recipients[recipientIndex].ID;
        recipients.splice(recipientIndex, 1);
      }
      else {
        return assignRecipientsToGivers(givers, originalRecipients);
      }
    }
    return givers;
  }
  catch (e) {
    console.log(`Error assigning matches at line ${e.lineNumber} in ${e.fileName}. Please try again.`, e.message);
    return;
  }
}

function printMatches(personArray) {
  const resultDiv = document.getElementById('results');
  for (let person of personArray) {
    let recipient = people.find(p => p.ID === person.giftRecipientID);
    //console.log(`${person.name} gives to ${recipient.name}`);
    var currentResult = document.createElement('li');
    currentResult.id = `result-${person.ID}`
    currentResult.innerHTML = `${person.name}<span id='recipient-${person.ID}' hidden> gives to ${recipient.name}</span>`;
    resultDiv.appendChild(currentResult);

    currentResult.addEventListener('mousedown', function (e) {
      var hiddenSpan = e.target.firstElementChild;
      hiddenSpan.hidden = false;
    });

    currentResult.addEventListener('mouseup', function (e) {
      var hiddenSpan = e.target.firstElementChild;
      hiddenSpan.hidden = true;
    });
  }
  document.getElementById('pickNamesButton').disabled = true;
}

function clearPreviousResults() {
  const resultDiv = document.getElementById('results');
  while (resultDiv.firstChild) {
    resultDiv.removeChild(resultDiv.firstChild);
  }
}

const main = () => {
  clearPreviousResults();
  const givers = initializeGivers(people);
  //assignRandomPartners(givers);
  const recipients = getRandomRecipients(givers);
  const assignments = assignRecipientsToGivers(givers, recipients);
  printMatches(assignments)
};