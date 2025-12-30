# Course Data Directory

## Using a Local CSV File

To use a local CSV file instead of fetching from a remote URL:

1. **Download the CSV** from PakGolf Studios:
   - Visit: https://pakgolfstudios.com/gspro-course-list/
   - Look for the CSV download/export option
   - Save the file as `gspro-course-list.csv`

2. **Place the CSV in this directory:**
   ```
   /public/data/gspro-course-list.csv
   ```

3. **Set the environment variable** in your `.env.local`:
   ```bash
   COURSE_CSV_URL=/data/gspro-course-list.csv
   ```

4. **Run the sync:**
   ```bash
   curl http://localhost:3000/api/sync/courses-csv
   ```

## CSV Format

The CSV should have these columns (in order):
1. Server
2. Name
3. Location
4. Designer
5. Version
6. Updated
7. TourStop (Yes/No)
8. Major Venue (Yes/No)
9. Historic (Yes/No)

## Using a Remote URL

To use a remote CSV URL instead:

1. **Set the environment variable** in your `.env.local`:
   ```bash
   COURSE_CSV_URL=https://your-domain.com/path/to/courses.csv
   ```

2. The system will automatically fetch from the remote URL

## Cloud Storage Options

You can also host your CSV on:
- **Netlify**: `/public/data/gspro-course-list.csv` (served automatically)
- **Vercel**: Same as Netlify
- **AWS S3**: Set public read permissions and use the S3 URL
- **Google Drive**: Use a direct download link
- **Dropbox**: Use a direct download link
