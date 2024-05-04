import express from 'express';
import cors from 'cors';
import query from './db.js';
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/*
                            * Retrieving a limited amount of data from the database *
     You can set a limit to the data in the first endpoint by uncommenting "// LIMIT TOINTEGER($limit)" 
 but keep in mind that all the other queries will work on the whole data set, so only consider the limit for
 speed testing . You pass the value of the ":limit" in Home.jsx in the useEffect where i call the data 
 retrieval query .
*/

/*
                            * Getting the similarity percentage between the 5 most similar recipes *
       I've used "Jaccard similarity coefficient" to get the similiarity coefficient between two sets
  I couldd have used all the available linked nodes to the Recipe but i thought it was overkill and i kept it simple 
  by only choosing the ingredients between two recipes as the sets in the Jaccard calculation plus calculating the
  discrepancy between the cookingTimes and the preparationTimes of the recipes and adding them to the similarity coefficient
*/

app.get('/data/:limit', async (req, res) => {
    const limit = req.params.limit;
    const data = await query(`
    MATCH (recipe:Recipe)-[:CONTAINS_INGREDIENT]->(ingredient:Ingredient)
    MATCH (author:Author)-[:WROTE]->(recipe)
    WITH DISTINCT recipe, author, COLLECT(DISTINCT ingredient.name) AS ingredients
    RETURN { 
        name: recipe.name, 
        skill: recipe.skillLevel, 
        preparationTime: recipe.preparationTime, 
        cookingTime: recipe.cookingTime,
        description: recipe.description,
        ingredients: ingredients,
        author: author.name 
    }
    ORDER BY recipe.name ASC
    // LIMIT TOINTEGER($limit)
    `, { limit });

    res.json(data.map(x => x[0]));
});


app.get('/additional_details/:recipe', async (req, res) => {
    const recipe = req.params.recipe;
    const data = await query(`
    OPTIONAL MATCH (recipe:Recipe)
    WHERE TRIM(recipe.name) = TRIM($recipe)
    OPTIONAL MATCH (recipe)-[:DIET_TYPE]->(diet:DietType)
    OPTIONAL MATCH (recipe)-[:COLLECTION]->(collection:Collection)
    OPTIONAL MATCH (recipe)-[:KEYWORD]->(keyword:Keyword)
    WITH DISTINCT recipe, 
        COLLECT(DISTINCT diet.name) AS dietTypes, 
        COLLECT(DISTINCT collection.name) AS collections, 
        COLLECT(DISTINCT keyword.name) AS keywords
    RETURN { 
        name: recipe.name,
        dietTypes: dietTypes,
        collections: collections,
        keywords: keywords
    }

        `, { recipe })
    res.json(data.map(x => x[0]));
});

app.get('/most_prolific_authors', async (req, res) => {
    const data = await query(`
        MATCH (a:Author)-[:WROTE]->(r:Recipe)
        WITH a, COUNT(r) AS recipesWritten
        ORDER BY recipesWritten DESC
        RETURN a.name AS author, recipesWritten
        LIMIT 5;
    `)
    res.json(data.map(x => {
        return {
            name: x[0],
            recipesWritten: x[1].low
        }
    }));
});

app.get('/most_common_ingredients', async (req, res) => {
    const data = await query(`
        MATCH (r:Recipe)-[:CONTAINS_INGREDIENT]->(i:Ingredient)
        WITH i, COUNT(r) AS recipesContainingIngredient
        ORDER BY recipesContainingIngredient DESC
        RETURN i.name AS ingredient, recipesContainingIngredient
        LIMIT 5;
    `)
    res.json(data.map(x => {
        return {
            name: x[0],
            recipesContainingIngredient: x[1].low
        }
    }));
});

app.get('/get_similarity_percentage/:recipe', async (req, res) => {
    const recipe = req.params.recipe;
    const data = await query(`
        MATCH (r:Recipe)
        WHERE TRIM(r.name) = TRIM($recipe) 
        OPTIONAL MATCH (r)-[:CONTAINS_INGREDIENT]->(i:Ingredient)
        WITH r, COLLECT(DISTINCT i.name) AS ingredients, r.cookingTime AS cookingTime, r.preparationTime AS preparationTime
        
        MATCH (otherRecipe:Recipe)
        WHERE otherRecipe <> r
        OPTIONAL MATCH (otherRecipe)-[:CONTAINS_INGREDIENT]->(otherIngredient:Ingredient)
        
        WITH r, otherRecipe, ingredients, cookingTime, preparationTime,
            COLLECT(DISTINCT otherIngredient.name) AS otherIngredients, 
            otherRecipe.cookingTime AS otherCookingTime, otherRecipe.preparationTime AS otherPreparationTime
        
        WITH r, otherRecipe,
            toFloat(size([ing IN ingredients WHERE ing IN otherIngredients])) / (size(ingredients) + size(otherIngredients)) AS ingredientSimilarity,
            abs(cookingTime - otherCookingTime) AS cookingTimeDifference,
            abs(preparationTime - otherPreparationTime) AS preparationTimeDifference
        
        WITH r, otherRecipe,
            (ingredientSimilarity + (1 / (1 + cookingTimeDifference)) + (1 / (1 + preparationTimeDifference))) / 3 AS similarity
        
        ORDER BY similarity DESC
        LIMIT 5
        
        RETURN otherRecipe.name AS SimilarRecipe, similarity * 100 AS SimilarityPercentage
    `, { recipe });
    res.json(data.map(x => {
        return {
            name: x[0],
            SimilarityPercentage: x[1]
        }
    }));
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

