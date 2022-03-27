var countWidth = 0;
var countHeight = 0;
var height = 9;
var width = 9;
var mines = 10;
var countMines = mines;
var time = 0;
var first = 0;
var bombs = [];
var rightMouseClicked = false;

$(document).ready(function () {
  gameOptions(height, width, mines);
  first = 0;
});

// menu window settings and buttons

$(window).ready(function () {
  // menu button

  $(".menu").click(function () {
    if (!$(".menu-window").hasClass("show")) {
      $(".menu-window").addClass("show");
      $("body")
        .append('<div class="dark-back"></div>')
        .ready(function () {
          $(".dark-back").click(function () {
            $(".menu-window").removeClass("show");
            $(".dark-back").remove();
          });
        });
    } else {
      $(".menu-window").removeClass("show");
      $(".dark-back").remove();
    }

    $('[name="height"]').val("");
    $('[name="width"]').val("");
    $('[name="mines"]').val("");
  });

  // close button

  $(".close-button").click(function () {
    $(".menu-window").removeClass("show");
    $(".dark-back").remove();
  });

  // start button

  $(".start-button").click(function () {
    var type = $("input[name=select]:checked").val();

    height = Number($("#type-" + type).attr("attr-height"));
    width = Number($("#type-" + type).attr("attr-width"));
    mines = Number($("#type-" + type).attr("attr-mines"));

    var customHeight = Number($("#height-4").val());
    var customWidth = Number($("#width-4").val());
    var customMines = Number($("#mines-4").val());

    if (type == 4) {
      if (customHeight >= 9) {
        height = customHeight;
      } else if (customHeight < 9 && customHeight > 0) {
        height = 9;
      }

      if (customWidth >= 9 && customWidth <= 45) {
        width = customWidth;
      } else if (customWidth < 9 && customWidth > 0) {
        width = 9;
      } else if (customWidth > 45) {
        width = 45;
      }

      if (customMines >= 9) {
        mines = customMines;
      } else if (customMines < 9 && customMines > 0) {
        mines = 10;
      }
    }

    gameOptions(height, width, mines);
    first = 0;
    clearInterval(time);
    $(".time").html('<h5 class="the-time">' + 0 + "</h5>");
    countMines = mines;
    $(".bombs").html('<h5 class="the-bombs">' + countMines + "</h5>");
    $(".smiley").html(
      '<img class="the-smiley" src="images/smiley.png" alt="">'
    );
    $("#end").remove();

    $(".menu-window").removeClass("show");
    $(".dark-back").remove();
  });

  // night mode

  $("input[name=night").on("change", function () {
    if ($(this).is(":checked")) {
      $("body").css("background-color", "black");
      $(".menu-text").css("color", "white");
    } else {
      $("body").css("background-color", "white");
      $(".menu-text").css("color", "black");
    }
  });
});

// smiley button

$(".smiley").click(function () {
  gameOptions(height, width, mines);
  first = 0;
  clearInterval(time);
  $(".time").html('<h5 class="the-time">' + 0 + "</h5>");
  countMines = mines;
  $(".bombs").html('<h5 class="the-bombs">' + countMines + "</h5>");
  $(".smiley").html('<img class="the-smiley" src="images/smiley.png" alt="">');
  $("#end").remove();
});

// game options, making rows and columns

function gameOptions(height, width) {
  var table = "";
  var spotNumber = 1;
  for (countHeight = 1; countHeight <= height; countHeight++) {
    table = table + "<tr>";

    for (countWidth = 1; countWidth <= width; countWidth++) {
      table =
        table +
        '<td><div class="spot" number="' +
        spotNumber +
        '" row="' +
        countHeight +
        '" column="' +
        countWidth +
        '" id="spot-' +
        spotNumber +
        '" onclick="clickOnSpot(' +
        spotNumber +
        ')"></div></td>';

      // `<td>
      //   <div class="spot" number="${spotNumber}" ></div>
      // </td>`;

      spotNumber++;
    }

    table += "</tr>";
  }
  $(".spots").html(table);
}

// getting random number

function randomNumber(countFrom) {
  var x = Math.floor(Math.random() * countFrom + 1);
  return x;
}

// planting bombs

function plantingBombs(countFrom, mines, firstSpot) {
  bombs = [];

  var randomSpot = randomNumber(countFrom);
  while (bombs.length < mines) {
    if (firstSpot != randomSpot) {
      if (!bombs.includes(randomSpot)) {
        bombs.push(randomSpot);
        // $("#spot-" + randomSpot).html(
        //   '<img class="bomb" src="images/bomb.png" alt="">'
        // );

        randomSpot = randomNumber(countFrom);
      } else {
        randomSpot = randomNumber(countFrom);
      }
    } else {
      randomSpot = randomNumber(countFrom);
    }
  }
}

// first click-start and open blocks and game over and victory 1

function clickOnSpot(id) {
  //first click

  if (first == 0) {
    plantingBombs(height * width, mines, id);
    first = 1;
    timer();
  }

  var bombCount = bombCounting(id);
  var neighbors = neighborCheck(id);

  // open blocks and game over adn victory 1

  if (
    !$("#spot-" + id).hasClass("opened") &&
    !$("#spot-" + id).hasClass("flaged")
  ) {
    if (!bombs.includes(id)) {
      if (bombCount == 0) {
        $("#spot-" + id)
          .css("background-image", "url(images/0.png)")
          .addClass("opened");
        for (var i = 0; i < neighbors.length; i++) {
          clickOnSpot(neighbors[i]);
        }
      } else {
        $("#spot-" + id)
          .css("background-image", "url(images/" + bombCount + ".png)")
          .addClass("opened");
      }
    }

    // game over
    else {
      $("#spot-" + id).css("background-image", "url(images/red.png)");
      $(".smiley").html(
        '<img class="the-smiley" src="images/lose.png" alt="">'
      );
      gameOver_noClick();
      wronglyFlaged();
      showBombs();
    }

    // victory 1
    var openedCount = 0;

    $(".spot").each(function () {
      if ($(this).hasClass("opened")) {
        openedCount++;
      }
    });

    if (openedCount + mines == height * width) {
      $(".smiley").html('<img class="the-smiley" src="images/win.png" alt="">');
      over_noClick("type_1");
    }
  }
}

// neighbor spots checking

function neighborCheck(id) {
  neighbor = [];

  var row = Number($("#spot-" + id).attr("row"));
  var column = Number($("#spot-" + id).attr("column"));

  if (row - 1 > 0) {
    neighbor.push(id - width);

    if (column - 1 > 0) {
      neighbor.push(id - (width + 1));
    }
    if (column + 1 <= width) {
      neighbor.push(id - (width - 1));
    }
  }

  if (row > 0) {
    if (column - 1 > 0) {
      neighbor.push(id - 1);
    }
    if (column + 1 <= width) {
      neighbor.push(id + 1);
    }
  }

  if (row + 1 <= height) {
    neighbor.push(id + width);

    if (column - 1 > 0) {
      neighbor.push(id + (width - 1));
    }
    if (column + 1 <= width) {
      neighbor.push(id + (width + 1));
    }
  }

  // console.log(neighbor);

  return neighbor;
}

// bomb counting

function bombCounting(id) {
  var bombCount = 0;
  var neighbors = neighborCheck(id);
  for (var i = 0; i < neighbors.length; i++) {
    if (bombs.includes(neighbors[i])) {
      bombCount++;
    }
  }

  // console.log(bomCount);
  return bombCount;
}

// win over no click

function over_noClick(type = "type_2") {
  $("body").append('<div class="end" id="end"></div>');
  setTimeout(function () {
    alert("You Win!");
    clearInterval(time);
  }, 100);
}

// game over no click

function gameOver_noClick() {
  $("body").append('<div class="end" id="end"></div>');
  setTimeout(function () {
    alert("Game Over!");
    clearInterval(time);
  }, 100);
}

// timer

function timer() {
  countTime = 1;
  time = setInterval(function () {
    if (countTime == 999) {
      clearInterval(time);
      $(".time").html('<h5 class="the-time">' + countTime + "</h5>");
      gameOver_noClick();
      alert("Game Over!");
    }
    $(".time").html('<h5 class="the-time">' + countTime + "</h5>");
    countTime++;
  }, 1000);
}

// right click

function rightClick(e) {
  //e.button describes the mouse button that was clicked
  // 0 is left, 1 is middle, 2 is right

  var spot = $(e.toElement);

  if (e.button === 2) {
    rightMouseClicked = true;

    if (!spot.hasClass("spot")) {
      spot = spot.parent();
    }

    // spot.removeClass("spot_flag");

    var clickedSpot = spot.attr("number");

    if (
      !$("#spot-" + clickedSpot).hasClass("opened") &&
      $("#spot-" + clickedSpot).hasClass("spot")
    ) {
      if (!$("#spot-" + clickedSpot).hasClass("flaged")) {
        $("#spot-" + clickedSpot).addClass("flaged");
        $("#spot-" + clickedSpot).html(
          '<img class="flag" src="images/flag.png" alt="">'
        );

        countMines--;
        $(".bombs").html('<h5 class="the-bombs">' + countMines + "</h5>");
      } else {
        // spot.addClass("spot_flag");

        countMines++;
        $(".bombs").html('<h5 class="the-bombs">' + countMines + "</h5>");

        $("#spot-" + clickedSpot).html("");
        $("#spot-" + clickedSpot).removeClass("flaged");
      }
    }
    countFoundBombs();
  }

  // console.log(countMines);
}

$(".game-part").get(0).addEventListener("mousedown", rightClick);
$(".game-part")
  .get(0)
  .addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

// count found bombs and victory 2

function countFoundBombs() {
  var flagedCount = 0;

  $(".flaged").each(function () {
    var flagedSpot = Number($(this).attr("number"));

    if (bombs.includes(flagedSpot)) {
      flagedCount++;
    }
  });

  // victory 2

  if (flagedCount == mines && countMines == 0) {
    $(".smiley").html('<img class="the-smiley" src="images/win.png" alt="">');
    over_noClick();
  }
}

function wronglyFlaged() {
  var flagedWrong = 0;

  $(".flaged").each(function () {
    var wrongSpot = Number($(this).attr("number"));

    if (!bombs.includes(wrongSpot)) {
      flagedWrong++;

      $("#spot-" + wrongSpot).html(
        '<img class="cross" src="images/cross.png" alt="">'
      );
      $("#spot-" + wrongSpot).css("background-image", "url(images/bomb.png)");
    }
  });
}

function showBombs() {
  for (i = 0; i < bombs.length; i++)
    if (!$("#spot-" + bombs[i]).hasClass("flaged")) {
      $("#spot-" + bombs[i]).html(
        '<img class="bomb" src="images/bomb.png" alt="">'
      );
    }
  // console.log(bombs[i]);
}
