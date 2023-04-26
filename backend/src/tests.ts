import { assert } from 'console';
import { Box, Wrapper, Supplier, WrapperBoxCombo } from './entities';
import { MockBoxRepository, MockWrapperRepository, MockSupplierRepository, MockWrapperBoxComboRepository } from './mockRepos';
import { IBoxRepository, ISupplierRepository, IWrapperRepository, IWrapperBoxComboRepository } from './repos';
import { Service } from './service';
import { ObjectId } from 'mongodb';
function runTests(): void {
    const mockBoxRepo = new MockBoxRepository();
    const mockWrapperRepo = new MockWrapperRepository();
    const mockSupplierRepo = new MockSupplierRepository();
    const mockComboRepo = new MockWrapperBoxComboRepository();

    const mockService = new Service(mockBoxRepo, mockWrapperRepo, mockSupplierRepo, mockComboRepo);

    // filtered box tests

    const boxfilter = Promise.resolve(mockService.getBoxesLargerThan(2));

    boxfilter.then((boxes) => {
        assert(boxes.length === 3, "Error: getBoxesLargerThan() returned an incorrect number of boxes");
        assert(boxes[0].length === 3, "Error: getBoxesLargerThan() returned an incorrect box");
        assert(boxes[1].length === 4, "Error: getBoxesLargerThan() returned an incorrect box");
        assert(boxes[2].length === 5, "Error: getBoxesLargerThan() returned an incorrect box");
    });

    const boxfilter2 = Promise.resolve(mockService.getBoxesLargerThan(3));

    boxfilter2.then((boxes) => {
        assert(boxes.length === 2, "Error: getBoxesLargerThan() returned an incorrect number of boxes");
        assert(boxes[0].length === 4, "Error: getBoxesLargerThan() returned an incorrect box");
        assert(boxes[1].length === 5, "Error: getBoxesLargerThan() returned an incorrect box");
    });

    const boxfilter3 = Promise.resolve(mockService.getBoxesLargerThan(5));

    boxfilter3.then((boxes) => {
        assert(boxes.length === 0, "Error: getBoxesLargerThan() returned an incorrect number of boxes");
    });

    const boxfilter4 = Promise.resolve(mockService.getBoxesLargerThan(0));
    const allboxes = Promise.resolve(mockService.getAllBoxes());

    boxfilter4.then((boxes) => {
        allboxes.then((allboxes) => {
            assert(boxes.length === allboxes.length, "Error: getBoxesLargerThan() returned an incorrect number of boxes");
            for (let i = 0; i < boxes.length; i++) {
                assert(boxes[i] === allboxes[i], "Error: getBoxesLargerThan() returned an incorrect box");
            }
        });
    });

    // average wrapper length tests

    const averagewrapperlength = Promise.resolve(mockService.getAverageWrapperLengths());

    averagewrapperlength.then((averagewrapperlengths) => {
        const expected = [
            {
                supplier: {
                    "_id": new ObjectId("64000000abcdef0000140002"),
                    "name": "supplier 3",
                    "address": "address",
                    "phone": "555-0002",
                    "email": "asd@asd.com"
                },
                averageLength: 6
            },
            {
                supplier: {
                    "_id": new ObjectId("64000000abcdef0000140001"),
                    "name": "supplier 2",
                    "address": "address",
                    "phone": "555-0001",
                    "email": "asd@asd.com"
                },
                averageLength: 4
            },
            {
                supplier: {
                    "_id": new ObjectId("64000000abcdef0000140000"),
                    "name": "supplier 1",
                    "address": "address",
                    "phone": "555-0000",
                    "email": "asd@asd.com"
                },
                averageLength: 1.5
            },
            {
                supplier: {
                    "_id": new ObjectId("64000000abcdef0000140003"),
                    "name": "supplier 4",
                    "address": "address",
                    "phone": "555-0003",
                    "email": "asd@asd.com"
                },
                averageLength: NaN
            }
        ];

        assert(averagewrapperlengths.length === expected.length, "Error: getAverageWrapperLengths() returned an incorrect number of averages");
        for (let i = 0; i < averagewrapperlengths.length; i++) {
            // console.log(averagewrapperlengths[i].supplier._id);
            // console.log(expected[i].supplier._id);
            assert(averagewrapperlengths[i].supplier._id?.toString() == expected[i].supplier._id.toString(), "Error: getAverageWrapperLengths() returned an incorrect supplier");

            // console.log(averagewrapperlengths[i].averageLength);
            // console.log(expected[i].averageLength);
            assert(averagewrapperlengths[i].averageLength === expected[i].averageLength ||
                (isNaN(averagewrapperlengths[i].averageLength) && isNaN(expected[i].averageLength))
                , "Error: getAverageWrapperLengths() returned an incorrect average");
        }
    });
}

export { runTests };