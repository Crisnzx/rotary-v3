class RotaryEvent {
   constructor (id, situation, arrivalTime, exitTime, waitTime, leaderTime, followerTime, timeBetween) {
      this.id = id;
      this.situation = situation;
      this.arrivalTime = arrivalTime;
      this.exitTime = exitTime;
      this.waitTime = waitTime;

      
      this.leaderTime = leaderTime;
      this.followerTime = followerTime;
      this.timeBetween = timeBetween;
   }

}