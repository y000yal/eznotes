$(document).ready(function () {
    function getNotes() {
      chrome.storage.local.get(["notes"], function (result) {
        let allNotes = result.notes.reverse();
        $(allNotes).each(function (key, index) {
          var list =
            '<div class="col-12">\
          <div class="accordion" id="note-id-' +
            key +
            '">\
            <div class="accordion-item">\
              <div class="accordion-header" id="panelsStayOpen-heading-' +
            key +
            '">\
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse-' +
            key +
            '" aria-expanded="false" aria-controls="panelsStayOpen-collapse-' +
            key +
            '">\
              <h6 contenteditable style="width:80%; outline-width: 0 !important;"  class="nt-' +
            key +
            '">\
                   ' +
            index.title +
            '  \
              </h6>\
                </button>\
              </div>\
              <div id="panelsStayOpen-collapse-' +
            key +
            '" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading-' +
            key +
            '">\
                <div class="accordion-body nb-' +
            key +
            '" contenteditable>\
                ' +
            index.content +
            '  \
                </div>\
                <div class="d-flex m-2 gap-2" data-key = "' +
            key +
            '">\
                <button class="btn btn-outline-primary btn-sm update-note"><i class="fa fa-save"></i></button>\
                <button class="btn btn-outline-danger btn-sm delete-note" data-bs-toggle="modal" data-bs-target="#deleteNoteModal"><i class="fa fa-trash-can">Save</i></button>\
              </div>\
              </div>\
            </div>\
          </div>\
        </div>';
          var listContainer = $("#note-list");
          $(listContainer).append(list);
        });
      });
    }
    getNotes(); //call to load all notes
    //utility function to call modal
    function closeModal(modalName) {
      $(`#${modalName}`).modal("hide");
    }
    //save new note
    $("#save-note").on("click", () => {
      const newNote = {
        title: $(".modal-title").text(),
        content: $("#note-area").text(),
      };
  
      chrome.storage.local.get(["notes"], function (result) {
        const allNotes = result.notes;
        if (allNotes) {
          allNotes.push(newNote);
        }
        chrome.storage.local.set({ notes: allNotes ?? [newNote] });
        var listContainer = $("#note-list");
        $(listContainer).empty();
        getNotes();
        $(".modal-title").empty().text("Title");
        $("#note-area").empty().text("Start Typing");
        closeModal("exampleModal");
      });
    });
    //update note
    $(document).on("click", ".update-note", function () {
      var key = $(this).parent().data("key");
      var title = $(`.nt-${key}`).html();
      var content = $(`.nb-${key}`).html();
      chrome.storage.local.get(["notes"], function (result) {
        const allNotes = result.notes.reverse();
        allNotes[key].content = content;
        allNotes[key].title = title;
        chrome.storage.local.set({ notes: allNotes.reverse() });
      });
    });
    //delete note
    $(document).on("click", ".delete-note", function () {
      $("#deleteNoteModal").attr("data-delete-key", $(this).parent().data("key"));
    });
  
    $("#confirm-delete").on("click", () => {
      var key = $("#deleteNoteModal").attr("data-delete-key");
      chrome.storage.local.get(["notes"], function (result) {
        const allNotes = result.notes;
        delete allNotes[key];
        var filteredNotes = allNotes.filter(function (el) {
          return el != null;
        });
        chrome.storage.local.set({ notes: filteredNotes });
        $(`#note-id-${key}`).parent().remove();
        closeModal("deleteNoteModal");
      });
    });
    $(document).on("keypress", ".accordion-button", function (e) {
      if (e.keyCode == 32) {
        var val = $(this).children().find("h6").text();
        $(this).children().find("h6").text(val+" ");
      }
    });
  });
  