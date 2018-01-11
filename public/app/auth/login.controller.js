app.controller('LoginController', function ($scope,$location) {
  $scope.login = ()=>{
    if($scope.nickname === undefined){
      $scope.nickname = geneRanString();
    }
    socket = io.connect('http://localhost:3000');
    let hash = CryptoJS.MD5($scope.email);
    socket.emit('connUser',{nickname: $scope.nickname, emailhash: String(hash)}, (data)=>{
       if(data.status == true){
          nickname = $scope.nickname;
          $scope.$apply(function(){
             $location.path('/chat');
          });
       } else{
          alert('Nickname already taken!');
       }
    });
  }

  let geneRanString = ()=>{
    let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
  }
});
