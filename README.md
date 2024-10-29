# Songalyze 🎵

A web-based music analysis tool for managing song metadata and exploring song structures.

## Built With
- **Backend**: FastAPI  
- **Frontend**: React with TypeScript  
- **Database**: PostgreSQL  

## Why?

As sonmeone who likes to produce music in his spare time, I often have an idea of the type of song I'd like to make without knowing the specifics. If I know the genre of the song I want to make, I like to look up similar songs produced in that genre to get inspiration from chords used in the song or the BPM. Because of this, I wanted a place where I can easily store the info of songs I like and retrieve them whenever I want to produce a similar type of song. While currently the only editable options for songs are the BPM and chord progression (which I have to find and write out myself), I plan on adding more helpful information for songs in the future.

## Quick Start

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/kjalba/songalyze.git
   ```

2. Navigate to the project directory:

   ```sh
   cd songalyze
   ```

3. Install backend dependencies:

   ```sh
   cd backend
   pip install -r requirements.txt
   ```

4. Install frontend dependencies:

   ```sh
   cd ../frontend
   npm install
   ```

5. Start the backend server:

   ```sh
   cd ../backend
   uvicorn main:app --reload
   ```

6. Start the frontend development server:

   ```sh
   cd ../frontend
   npm start
   ```

Now you can access the application at `http://localhost:3000`.

## Usage

- **Add Songs**: Input song metadata like title, artist, genre, mood, and BPM.  
- **Search Songs**: Retrieve matching songs by genre, chord progression, or BPM.  
- **Edit Metadata**: Easily update or delete song information through the interface.

## Roadmap

The following features are planned for future releases:

- [ ] Add visualization for chord progressions.  
- [ ] Implement user authentication for personal song libraries.  
- [ ] Introduce API endpoints for external music databases.  
- [ ] Optimize the UI with dark mode and enhanced accessibility.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Open a pull request.

Feel free to open an issue to discuss improvements or features before starting your work.