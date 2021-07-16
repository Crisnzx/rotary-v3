class RotaryEvent {
   constructor (vehicleID, situation, vehicleArrived, vehicleLeft, waitTime, leader, follower, timeBetween) {
      this.vehicleID = vehicleID;
      this.situation = situation;
      this.vehicleArrived = vehicleArrived;
      this.vehicleLeft = vehicleLeft;
      this.waitTime = waitTime;

      
      this.leader = leader;
      this.follower = follower;
      this.timeBetween = timeBetween;
   }

}