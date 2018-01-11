app.controller('ChatController', function ($scope, $location, $timeout) {

  let messages = {};
  $scope.mynickname = nickname;
  $scope.activeChat = false;
  $scope.emptyChat = true;
  // in case user refresh the page, there's no socket instance in this case
  if(socket == undefined){
    $location.path('/');
    return false;
  }

  $scope.loadChat = (data)=>{ 
    // pop values stores in $event object
    $scope.rec_socketid = data.currentTarget.attributes.socketid.value;
    $scope.selectedUser = data.currentTarget.attributes.nickname.value;
    // email hash for gravatar purpose
    $scope.selectedUserHash = data.currentTarget.attributes.emailhash.value;
    $scope.emptyChat = false;
    $scope.activeChat = true;
    $scope.conversation = messages[$scope.selectedUser];
  }

  $scope.sendMessage = (data)=>{
    // in case user press enter without any mess
    if($scope.message == '') return false;
    $scope.pushMessage($scope.selectedUser,nickname,$scope.message);
    socket.emit('sendmessage',{message:$scope.message,receiver:$scope.rec_socketid});
    $scope.message = '';
    $timeout(function(){
        $scope.conversation = messages[$scope.selectedUser];
        $scope.scrollToBottom();
    }, 100);
  }

  $scope.pushMessage = (user,sender,mess)=>{
    if(messages.hasOwnProperty(user)){
    } else{
       messages[user] = [];
    }
    let msg = {
       from: sender,
       message: mess
    };
    messages[user].push(msg);
  }

  $scope.scrollToBottom = function(){
    $timeout(function() {
      let scroller = document.getElementById("chat-data");
      scroller.scrollTop = scroller.scrollHeight;
    }, 0, false);
  }

  //send notification function
  let sendNotification =(user, msg)=>{
    if (Notification.permission === 'granted') {
      let notification = new Notification(user + msg, {
      });
      notification.onclick = function() {
        parent.focus();
        this.close();
      };
      $timeout(()=>{
        notification.close.bind(notification)}, 3000);
    }
  }

  // listen on socket event
  socket.on('users', (users)=>{
  $scope.$apply(function(){
    // filter out user self 
    $scope.users = users.filter(function(item) { return item.nickname !== nickname; }); 
      if($scope.users.length == 0){ //there's no other user online, initial UI
        $scope.emptyChat = true;
        $scope.activeChat = false;
        $scope.conversation = [];
      }
    });
  });

  socket.on('receivemessage',(data)=>{  
    $scope.pushMessage(data.nickname,data.nickname,data.message);
    
    $timeout(function(){
      if($scope.selectedUser == data.nickname){
        $scope.conversation = messages[data.nickname];
        $scope.scrollToBottom();
      }
    }, 100);
    sendNotification(data.nickname, "send you a message");
  });
});