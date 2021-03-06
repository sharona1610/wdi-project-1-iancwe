$(document).ready(function () {
  console.log('jQuery up and running!')
  // keydown triggers
  var trig1 = false
  var trig2 = false
  var p1ChoTrig = false
  var p2ChoTrig = false
  var ourQn = []
  var choice1 = ''
  var choice2 = ''
  var id = ''

  // rolls(0-100) to see who starts first
  var p1Rolls = 0
  var p2Rolls = 0

  // variables for music genre
  var $audio = ''
  var $source = ''
  var picked = {}
  var chosen = {}

  // variables for scores/bets and player choices
  var p1Score = 35
  var p2Score = 35
  var ans = ''
  var playerChoice1 = ''
  var playerChoice2 = ''
  var p1Bets = null
  var p2Bets = null

  // button id and urls of button
  var butUrl = {
    'musBtn': 'https://iancwe.github.io/Queries/assets/music.json',
    'movBtn': 'https://iancwe.github.io/Queries/assets/movieqn.json',
    'sciBtn': 'https://iancwe.github.io/Queries/assets/science.json',
    'pplBtn': 'https://iancwe.github.io/Queries/assets/famPpl.json'
  }

  //  to check who starts first(chooses the question)
  function rolls () {
    p1Rolls = Math.random()
    p2Rolls = Math.random()
    if (p1Rolls > p2Rolls) {
      swal(
            'Player 1 gets to choose the category!',
            'Better luck next time Player 2',
            'info'
          )
    } else {
      swal(
            'Player 2 gets to choose the category!',
            'Tough luck Player 1',
            'info'
          )
    }
  }

  // Roll to see who starts and show button of genres
  $('#roll').click(function () {
    rolls()
    $('.genres').fadeIn()
    $('#roll').fadeOut()
    $('#ins').fadeOut()
    $('.cats').fadeIn()
  })

  // when click on any of the genres (put class for button and switch case for button id)
  $('.genres').click(function () {
    // new page layout for quiz section
    $('.genres').fadeOut()
    $('.field').hide()
    $('.quizArea').show()
    $('.cats').hide()
    $('#showP1').text('Player 1 : ' + p1Score)
    $('#showP2').text('Player 2 : ' + p2Score)
    id = this.id
    var choUrl = butUrl[id]

    // refreshing the triggers
    refresh()

    // extracting json data from another webpage
    var ourRequest = new XMLHttpRequest()
    ourRequest.open('GET', choUrl)
    ourRequest.onload = function () {
      ourQn = JSON.parse(ourRequest.responseText)

      // resetting the select tag to default before round sounds
      $('.bets').prop('selectedIndex', 0)

      // randomizing the question to be chosen
      var qnPick = Math.floor(Math.random() * ourQn.length)
      ans = ourQn[qnPick].answ
      var picked = ourQn.slice(qnPick, qnPick + 1)[0]
      // displaying question of the chosen question and check if music cat
      if (id === 'musBtn') {
        $('.question').text('Question: Guess the title of the song!')
        updateSrc(picked.song)

        // removing question from chosen genre
        var chosen = ourQn.splice(qnPick, 1)[0]
        console.log(chosen)

        // randomize the choices for each question
        choiceRandom(chosen)

        // getting player choices
        getKeys()
      } else {
        $('.question').text('Question:' + ourQn[qnPick].question)

      // removing question from chosen genre
        var chosen = ourQn.splice(qnPick, 1)[0]

      // randomize the choices for each question
        choiceRandom(chosen)

      // getting player choices
        getKeys()
      }
    }  /* onload functon ends here */
    ourRequest.send()
  }) /* end of button click function */

  // quit game button function
  $('#quit').on('click', function () {
    $('.genres').show()
    $('.field').show()
    $('.quizArea').hide()
    document.getElementById('song').pause()
  })

  function getKeys () {
    $(document).unbind('keydown')
    $(document).on('keydown', function (e) {
      if (e.keyCode === 87 || e.keyCode === 81 || e.keyCode === 69 || e.keyCode === 82) {
        if (e.keyCode === 81) { choice1 = $('#c1') }
        if (e.keyCode === 87) { choice1 = $('#c2') }
        if (e.keyCode === 69) { choice1 = $('#c3') }
        if (e.keyCode === 82) { choice1 = $('#c4') }
        if (!trig1) {
          trig1 = true
          p1ChoTrig = true
          playerChoice1 = choice1.text()
          console.log(choice1.text())
          choiceCheck(p1ChoTrig, p2ChoTrig)
        }
      }
    })

  // player 2 picking the answer(,./Lshift)

    $(document).on('keydown', function (e) {
      if (e.keyCode === 16 || e.keyCode === 191 || e.keyCode === 190 || e.keyCode === 188) {
        if (e.keyCode === 188) { choice2 = $('#cp1') }
        if (e.keyCode === 190) { choice2 = $('#cp2') }
        if (e.keyCode === 191) { choice2 = $('#cp3') }
        if (e.keyCode === 16) { choice2 = $('#cp4') }
        if (!trig2) {
          trig2 = true
          p2ChoTrig = true
          playerChoice2 = choice2.text()
          console.log(choice2.text())
          choiceCheck(p1ChoTrig, p2ChoTrig)
        }
      }
    })
  }

  // function for checking if both players made their choices
  function choiceCheck (c1, c2) {
    if (c1 && c2) {
      console.log('both player made their choices')
      comparAns(playerChoice1, playerChoice2, ans)
    } else {
      console.log('One of the player has yet to make a choice')
    }
  }

  // comparing player choices to answer
  function comparAns (p1, p2, sol) {
    p1Bets = $('#p1Bets').val()
    p2Bets = $('#p2Bets').val()
      // console.log(p1Bets)
      // console.log(p2Bets)
    if (p1 === sol && p2 === sol) {
      swal({
        title: 'Well Played',
        text: 'Both of you know your stuff eh?',
        timer: 1500
      })
      scoreUpdate()
    } else if (p1 === sol) {
      swal({
        title: 'Hot Stuff, Player 1',
        timer: 1500
      })
      console.log('p1')
      p2Score = (p2Score - p1Bets - p2Bets)
      scoreUpdate()
    } else if (p2 === sol) {
      swal({
        title: 'Dayuum! Player 2',
        timer: 1500
      })
      console.log('p2')
      p1Score = (p1Score - p2Bets - p1Bets)
      scoreUpdate()
    } else if (!(p1 === sol && p2 === sol)) {
      swal({
        title: 'Seriously?!',
        text: 'None of you got it?',
        timer: 1500
      })
      p1Score = (p1Score - p1Bets)
      p2Score = (p2Score - p2Bets)
      scoreUpdate()
    }
    if (nextGen() === true) {
      if (p1Score <= 0) {
        swal({
          title: 'Nice One, Player 2!',
          text: 'GG no rematch Player 1',
          timer: 8000
        }, playAgain())
      } else if (p2Score <= 0) {
        swal({
          title: 'WHOOHOOO Player 1',
          text: 'Git Gud Player 2',
          timer: 8000
        }, playAgain())
      } else {
        addQns()
        $('.bets').prop('selectedIndex', 0)
      }
    }
  }

// function for randomizing choices
  function choiceRandom (cho) {
    var choiceList = [
      [cho.choices[0]],
      [cho.choices[1]],
      [cho.choices[2]],
      [cho.choices[3]]
    ]
    for (var i = 4; i >= 0; i--) {
      var rnC = Math.floor(Math.random() * i)
      $('#c' + [i]).text(choiceList[rnC])
      $('#cp' + [i]).text(choiceList[rnC])
      var remCho = choiceList.splice(rnC, 1)
    }
  }

  // function for repopulating the question
  function addQns () {
    refresh()
    var qnPick = Math.floor(Math.random() * ourQn.length)
    ans = ourQn[qnPick].answ

    // checking if music genre or not
    if (!(id === 'musBtn')) {
    // displaying question of the chosen question
      $('.question').text('Question:' + ourQn[qnPick].question)

    // removing question from chosen genre
      var chosen = ourQn.splice(qnPick, 1)[0]

    // randomize the choices for each question
      choiceRandom(chosen)

    // getting player choices
      getKeys()
    } else {
      $('.question').text('Question: Guess the title of the song!')

      // randomizing the question to be chosen
      var qnPick = Math.floor(Math.random() * ourQn.length)
      ans = ourQn[qnPick].answ
      var picked = ourQn.slice(qnPick, qnPick + 1)[0]

    // removing question from chosen genre
      var chosen = ourQn.splice(qnPick, 1)[0]
      updateSrc(picked.song)

    // randomize the choices for each question
      choiceRandom(chosen)

    // getting player choices
      getKeys()
    }
  }

  function nextGen () {
    if (!(ourQn.length === 0)) {
      return true
    } else {
      swal({
        title: 'Onto green pastures!',
        timer: 1500
      })
      $('.genres').show()
      $('.field').show()
      $('.quizArea').hide()
      $('#roll').hide()
      $('#' + id).remove()
      document.getElementById('song').pause()
      return false
    }
  }

  // updating scores
  function scoreUpdate () {
    $('#showP1').text('Player 1 : ' + p1Score)
    $('#showP2').text('Player 2 : ' + p2Score)
  }

  // refresh trigger function
  function refresh () {
    trig1 = false
    trig2 = false
    p1ChoTrig = false
    p2ChoTrig = false
    playerChoice1 = null
    playerChoice2 = null
  }

  // audio tag change source function
  function updateSrc (songUrl) {
    $audio = $('#music')
    $source = $('#song')[0]
    $source.src = songUrl
    document.getElementById('song').play()
  }

  // modal boxes in landing page
  $('#instrtext').hide()
  $('#ins').click(function (event) {
    $('#instrtext').show()
  })
  $('#closeinstrtext').click(function (event) {
    $('#instrtext').hide()
  })

  // play again
  function playAgain () {
    $('.quizArea').hide()
    $('.field').show()
    $('#roll').show()
    $('#ins').show()
  }
})
