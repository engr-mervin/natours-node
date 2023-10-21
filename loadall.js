import { readFile } from 'fs/promises';
import 'dotenv/config';
import Tour from './models/tourModel.js';
const devData = await readFile('./dev-data/data/tours.json', {
    encoding: 'utf-8',
});
const tours = JSON.parse(devData).map((el) => {
    delete el.id;
    return el;
});
console.log(tours);
const uploadTours = async () => {
    try {
        await Tour.create(tours);
        console.log('Successfully uploaded tours');
    }
    catch (error) {
        console.log(error);
    }
    finally {
        process.exit();
    }
};
const deleteTours = async () => {
    try {
        await Tour.deleteMany();
        console.log('Successfully deleted DB');
    }
    catch (error) {
        console.log(error);
    }
    finally {
        process.exit();
    }
};
console.log(process.argv);
if (process.argv[2] === '--delete') {
    deleteTours();
}
else {
    uploadTours();
}
