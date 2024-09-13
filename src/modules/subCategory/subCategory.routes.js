import express from 'express';
import * as SCC from './subCategory.controller.js';
import * as SCV from './subCategory.validation.js'
import { multerHost, validExtension } from '../../../service/multerLocal.js';
import { systemRoles } from '../../../utils/systemRoles.js';
import { validation } from '../../../middlewares/validation.js';
import { auth } from '../../../middlewares/auth.js';
const router = express.Router();


router.post('/',
     multerHost(validExtension.image).single("image"),
     validation(SCV.subCategoryCreationValidationSchema),
     auth(systemRoles.admin), //["Admin"]
    SCC.createSubCategory); 


    router.put('/:id',
        multerHost(validExtension.image).single("image"),
        validation(SCV.subCategoryUpdateValidationSchema),
        auth(systemRoles.admin), 
       SCC.updateSubCategory); 

       router.delete('/:id', 
        auth(systemRoles.admin), 
        validation(SCV.deleteSubCategoryValidationSchema),
        SCC.deleteSubCategory);
   
        router.get('/count', SCC.getSubcategoriesCount);

        router.get('/pagination',
            validation(SCV.getSubcategoriesWithPaginationValidation),
            SCC.getSubcategoriesWithPagination);

        router.get('/all',
            SCC.getSubCategories);


            

export default router