export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        return serializedState === null ? undefined : serializedState;
    } catch (err) {
        console.error(err);
    }
}

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (err) {
        console.error(err);
    }
}