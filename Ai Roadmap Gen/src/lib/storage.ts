/**
 * Simple storage utility to manage roadmap progress persistence.
 */

const STORAGE_PREFIX = "roadmap_progress_";

const HISTORY_KEY = "roadmap_history";

export const getRoadmapProgress = (roadmapId: string): Record<number, boolean> => {
    try {
        const stored = localStorage.getItem(`${STORAGE_PREFIX}${roadmapId}`);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error("Failed to load progress from storage", e);
        return {};
    }
};

export const saveRoadmapProgress = (roadmapId: string, progress: Record<number, boolean>) => {
    try {
        localStorage.setItem(`${STORAGE_PREFIX}${roadmapId}`, JSON.stringify(progress));
    } catch (e) {
        console.error("Failed to save progress to storage", e);
    }
};

export interface RoadmapHistoryItem {
    id: string;
    goal: string;
    timestamp: number;
    roadmap: any;
}

export const saveRoadmapToHistory = (id: string, goal: string, roadmap: any) => {
    try {
        const history = getRoadmapHistory();
        const filtered = history.filter(item => item.goal !== goal);
        const newHistory = [{ id, goal, roadmap, timestamp: Date.now() }, ...filtered].slice(0, 10);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
        console.error("Failed to save roadmap to history", e);
    }
};

export const getRoadmapHistory = (): RoadmapHistoryItem[] => {
    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to load history", e);
        return [];
    }
};

// Generate a unique ID for a roadmap if it doesn't have one based on goal and duration
export const generateRoadmapId = (goal: string, duration: string) => {
    const str = `${goal}-${duration}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
};
