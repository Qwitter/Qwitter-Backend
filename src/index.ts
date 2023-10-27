import app from './app';
import swaggerDocs from './utils/swagger';

const port: number = 3000;
app.listen(port, () => {
  swaggerDocs(app, port);
  console.log(`App running on port ${port}...`);
});
