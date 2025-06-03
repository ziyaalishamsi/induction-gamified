// SCORM API integration for LMS communication
interface ScormAPI {
  Initialize: (parameter: string) => string;
  Terminate: (parameter: string) => string;
  GetValue: (element: string) => string;
  SetValue: (element: string, value: string) => string;
  Commit: (parameter: string) => string;
  GetLastError: () => string;
  GetErrorString: (errorCode: string) => string;
  GetDiagnostic: (errorCode: string) => string;
}

interface ScormData {
  learnerName: string;
  completionStatus: 'completed' | 'incomplete' | 'not attempted' | 'unknown';
  successStatus: 'passed' | 'failed' | 'unknown';
  scoreRaw: number;
  scoreMin: number;
  scoreMax: number;
  sessionTime: string;
  location: string;
  suspendData: string;
}

class ScormManager {
  private api: ScormAPI | null = null;
  private isInitialized = false;

  constructor() {
    this.findAPI();
  }

  // Find SCORM API in parent windows
  private findAPI(win?: Window): ScormAPI | null {
    let searchWindow = win || window;
    let attempts = 0;
    const maxAttempts = 7;

    while (attempts < maxAttempts) {
      try {
        // Look for SCORM 2004 API
        if (searchWindow.parent && (searchWindow.parent as any).API_1484_11) {
          return (searchWindow.parent as any).API_1484_11;
        }
        
        // Look for SCORM 1.2 API
        if (searchWindow.parent && (searchWindow.parent as any).API) {
          return (searchWindow.parent as any).API;
        }

        // Check current window
        if ((searchWindow as any).API_1484_11) {
          return (searchWindow as any).API_1484_11;
        }
        
        if ((searchWindow as any).API) {
          return (searchWindow as any).API;
        }

        if (searchWindow.parent === searchWindow) {
          break;
        }

        searchWindow = searchWindow.parent;
        attempts++;
      } catch (e) {
        break;
      }
    }

    return null;
  }

  // Initialize SCORM session
  public initialize(): boolean {
    this.api = this.findAPI();
    
    if (!this.api) {
      console.warn('SCORM API not found. Running in standalone mode.');
      return false;
    }

    try {
      const result = this.api.Initialize('');
      this.isInitialized = result === 'true';
      
      if (this.isInitialized) {
        console.log('SCORM API initialized successfully');
        // Set initial values
        this.setValue('cmi.completion_status', 'incomplete');
        this.setValue('cmi.success_status', 'unknown');
        this.commit();
      } else {
        console.error('Failed to initialize SCORM API');
      }
      
      return this.isInitialized;
    } catch (error) {
      console.error('Error initializing SCORM API:', error);
      return false;
    }
  }

  // Get value from LMS
  public getValue(element: string): string {
    if (!this.api || !this.isInitialized) {
      return '';
    }

    try {
      return this.api.GetValue(element);
    } catch (error) {
      console.error(`Error getting SCORM value for ${element}:`, error);
      return '';
    }
  }

  // Set value to LMS
  public setValue(element: string, value: string): boolean {
    if (!this.api || !this.isInitialized) {
      return false;
    }

    try {
      const result = this.api.SetValue(element, value);
      return result === 'true';
    } catch (error) {
      console.error(`Error setting SCORM value for ${element}:`, error);
      return false;
    }
  }

  // Commit data to LMS
  public commit(): boolean {
    if (!this.api || !this.isInitialized) {
      return false;
    }

    try {
      const result = this.api.Commit('');
      return result === 'true';
    } catch (error) {
      console.error('Error committing SCORM data:', error);
      return false;
    }
  }

  // Terminate SCORM session
  public terminate(): boolean {
    if (!this.api || !this.isInitialized) {
      return false;
    }

    try {
      const result = this.api.Terminate('');
      this.isInitialized = false;
      return result === 'true';
    } catch (error) {
      console.error('Error terminating SCORM session:', error);
      return false;
    }
  }

  // Get learner information
  public getLearnerInfo(): Partial<ScormData> {
    return {
      learnerName: this.getValue('cmi.learner_name'),
      completionStatus: this.getValue('cmi.completion_status') as any,
      successStatus: this.getValue('cmi.success_status') as any,
      scoreRaw: parseFloat(this.getValue('cmi.score.raw')) || 0,
      scoreMin: parseFloat(this.getValue('cmi.score.min')) || 0,
      scoreMax: parseFloat(this.getValue('cmi.score.max')) || 100,
      location: this.getValue('cmi.location'),
      suspendData: this.getValue('cmi.suspend_data')
    };
  }

  // Set completion status
  public setCompletionStatus(status: 'completed' | 'incomplete'): boolean {
    return this.setValue('cmi.completion_status', status);
  }

  // Set success status
  public setSuccessStatus(status: 'passed' | 'failed'): boolean {
    return this.setValue('cmi.success_status', status);
  }

  // Set score
  public setScore(raw: number, min: number = 0, max: number = 100): boolean {
    const success = this.setValue('cmi.score.raw', raw.toString()) &&
                   this.setValue('cmi.score.min', min.toString()) &&
                   this.setValue('cmi.score.max', max.toString());
    
    // Automatically set success status based on score
    if (success) {
      const passed = raw >= (max * 0.8); // 80% pass threshold
      this.setSuccessStatus(passed ? 'passed' : 'failed');
    }
    
    return success;
  }

  // Set location (bookmark)
  public setLocation(location: string): boolean {
    return this.setValue('cmi.location', location);
  }

  // Set suspend data (save progress)
  public setSuspendData(data: string): boolean {
    return this.setValue('cmi.suspend_data', data);
  }

  // Calculate and set session time
  public setSessionTime(startTime: Date): boolean {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    
    // Convert to ISO 8601 duration format (PT[n]H[n]M[n]S)
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    
    const sessionTime = `PT${hours}H${minutes}M${seconds}S`;
    return this.setValue('cmi.session_time', sessionTime);
  }

  // Check if SCORM is available
  public isAvailable(): boolean {
    return this.api !== null && this.isInitialized;
  }

  // Get last error
  public getLastError(): string {
    if (!this.api) return '';
    return this.api.GetLastError();
  }

  // Get error description
  public getErrorString(errorCode: string): string {
    if (!this.api) return '';
    return this.api.GetErrorString(errorCode);
  }
}

// Export singleton instance
export const scormManager = new ScormManager();

// Utility functions for common SCORM operations
export const initializeScorm = () => scormManager.initialize();
export const terminateScorm = () => scormManager.terminate();
export const commitScormData = () => scormManager.commit();
export const isScormAvailable = () => scormManager.isAvailable();

export default scormManager;