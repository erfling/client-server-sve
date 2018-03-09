import IBaseClass from './BaseModel';

export default interface PlatformExperiment extends IBaseClass {
    
    SystemicPoint: string;
   
    Decision: string;

    Hypothesis: string;

    Experiment: string;

    GameId: string;
    
}