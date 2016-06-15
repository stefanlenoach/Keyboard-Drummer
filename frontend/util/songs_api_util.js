module.exports = {
  getSongs: function (callback) {
    $.ajax({
      type: 'GET',
      url: 'api/songs',
      dataType: 'json',
      success: function (songs) {
        callback(songs);
      },
      error: function () {
        console.log("SongsApiUtil#getSongs error");
      }
    });
  },

  getSongBeats: function (songId, callback) {
    $.ajax({
      type: 'GET',
      url: 'api/songs/' + songId,
      dataType: 'json',
      success: function (songBeats) {
        callback(songBeats);
      },
      error: function () {
        console.log("SongsApiUtil#getSongBeats error");
      }
    });
  },

  createBeat: function (beat) {
    $.ajax({
      type: 'POST',
      url: 'api/beats',
      dataType: 'json',
      data: { beat: beat },
      success: function (beat) {
        console.log(beat);
      },
      error: function () {
        console.log("SongsApiUtil#addBeat error");
      }
    });
  }

};
