import app from './app';

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`ToDo API is running on port ${PORT}`);
});