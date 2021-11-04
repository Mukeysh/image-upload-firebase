let dropArea = document.getElementById("drop-area");
let events = ["dragenter", "dragover", "dragleave", "drop"];

events.forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefault, false);
});

function preventDefault(e) {
  e.preventDefault();
  e.stopPropagation();
}

["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false);
});

function highlight() {
  dropArea.classList.add("highlight");
}

["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlightRemove, false);
});

function highlightRemove() {
  dropArea.classList.remove("highlight");
}

dropArea.addEventListener("drop", handleDrop, false);
document
  .getElementById("chooseFile")
  .addEventListener("change", handleChangeFiles, false);

function handleChangeFiles(e) {
  handleFiles(e.srcElement.files[0], e.srcElement.files[0].name);
}
function handleDrop(e) {
  let dataTransfer = e.dataTransfer;
  let files = dataTransfer.files;
  handleFiles(files[0], files[0].name);
}

function handleFiles(path, name) {
  var storageRef = firebase.storage().ref(name);
  let task = storageRef.put(path);
  let downloadUrl = document.getElementById("download");
  task.on(
    "state_changed",
    (snap) => {
      var progress = Math.round(
        (snap.bytesTransferred / snap.totalBytes) * 100
      );
      document.getElementById("progress").innerHTML = progress;
      console.log("Upload is " + progress + "% done");
      console.log();
    },
    (error) => {
      // Handle unsuccessful uploads
      console.log("error" + error);
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      task.snapshot.ref.getDownloadURL().then((downloadURL) => {
        downloadUrl.innerHTML = "Download Url";
        downloadUrl.href = downloadURL;
        console.log("File available at", downloadURL);
      });
    }
  );
  task
    .then((snapshot) => {
      // 4
      previewFile(path);
      console.log("Image uploaded to the bucket!");
    })
    .catch((e) => console.log("uploading image error => ", e));
}

function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    let img = document.createElement("img");
    img.src = reader.result;
    document.getElementById("gallery").appendChild(img);
  };
}
