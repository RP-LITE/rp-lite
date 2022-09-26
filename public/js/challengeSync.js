const $challengeDiv = $('#challenges');
const $challengeList = $('#challenge-list');

socket.on('challengeUpdate',data => {
  console.log('data',data);
  const $existingCard = $(`#challenge-${data.cardID}`);
  if(data.delete){
    $existingCard?.remove();
  }else if($existingCard[0]){
    $existingCard.replaceWith(data.card);
  }else{
    const $topChallenge = $('#challenge-list > :first-child');
    $topChallenge.before(data.card);
  }
});