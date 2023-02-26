export type tStravaActivityOrigin = {
  id: number;
  external_id: string;
  name: string;
  distance: number; // meter
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  total_elevation_gain: number;
  elev_high: number; // meter
  elev_low: number; // meter
  start_date: Date;
  map: {
    id: string,
    summary_polyline: string;
  };
  athlete: {
    id: string;
  };
  sport_type: 'Badminton' | 'Crossfit' | 'EBikeRide' | 'MountainBikeRide' | 'Ride' | 'Run' | 'Swim' | 'TrailRun' | 'VirtualRun';
  average_heartrate: number;
  max_heartrate: number;
  kudos_count: number;
  achievement_count: number;
  athlete_count: number;
  private: boolean;
  // ...and a lot properties
}
export type tStravaActivity = {
  id: number;
  external_id: string;
  name: string;
  distance: number; // meter
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  total_elevation_gain: number;
  elev_high: number; // meter
  elev_low: number; // meter
  start_date: Date;
  map: string; // Polyline string -- converted from origin
  average_heartrate: number;
  max_heartrate: number;
}
export type tRaceInfo = {
  name: string;
  dst: number;
  run_date: Date;
}
