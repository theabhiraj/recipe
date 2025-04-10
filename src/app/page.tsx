'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useEffect, useState} from 'react';
import {generateRecipe, GenerateRecipeOutput} from '@/ai/flows/generate-recipe';
import {toast} from "@/hooks/use-toast";

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<GenerateRecipeOutput | null>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<GenerateRecipeOutput[]>([]);

  useEffect(() => {
    // Load favorite recipes from local storage on mount
    const storedFavorites = localStorage.getItem('favoriteRecipes');
    if (storedFavorites) {
      try {
        setFavoriteRecipes(JSON.parse(storedFavorites));
      } catch (error) {
        console.error("Failed to parse favorite recipes from local storage", error);
        // Handle the error, possibly by clearing the invalid data
        localStorage.removeItem('favoriteRecipes');
        setFavoriteRecipes([]);
      }
    }
  }, []);

  useEffect(() => {
    // Save favorite recipes to local storage whenever it changes
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
  }, [favoriteRecipes]);

  const handleGenerateRecipe = async () => {
    if (ingredients) {
      try {
        const generatedRecipe = await generateRecipe({ingredients});
        setRecipe(generatedRecipe);
      } catch (error: any) {
        console.error("Failed to generate recipe", error);
        toast({
          title: "Error",
          description: "Failed to generate recipe. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddToFavorites = () => {
    if (recipe) {
      setFavoriteRecipes(prevFavorites => {
        const isAlreadyFavorite = prevFavorites.some(favRecipe => favRecipe.recipeName === recipe.recipeName);
        if (isAlreadyFavorite) {
          // Recipe is already in favorites, so remove it
          const updatedFavorites = prevFavorites.filter(favRecipe => favRecipe.recipeName !== recipe.recipeName);
          toast({
            title: "Recipe Removed",
            description: `${recipe.recipeName} removed from favorites.`,
          });
          return updatedFavorites;
        } else {
          // Recipe is not in favorites, so add it
          const updatedFavorites = [...prevFavorites, recipe];
          toast({
            title: "Recipe Added",
            description: `${recipe.recipeName} added to favorites.`,
          });
          return updatedFavorites;
        }
      });
    }
  };

  const isFavorite = recipe && favoriteRecipes.some(favRecipe => favRecipe.recipeName === recipe.recipeName);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 px-4 bg-background">
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Fridge Feast</h1>
      <Card className="w-full max-w-2xl mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Ingredients</CardTitle>
          <CardDescription>Enter the ingredients you have available:</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Input
              type="text"
              placeholder="e.g., chicken, rice, vegetables"
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              className="input"
            />
          </div>
          <Button onClick={handleGenerateRecipe} className="btn bg-primary text-primary-foreground hover:bg-primary/80">
            Generate Recipe
          </Button>
        </CardContent>
      </Card>

      {recipe && (
        <Card className="w-full max-w-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{recipe.recipeName}</CardTitle>
            <CardDescription>Here's a recipe based on your ingredients:</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <h3 className="text-lg font-semibold">Ingredients:</h3>
              <ul className="list-disc list-inside">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div className="grid gap-2">
              <h3 className="text-lg font-semibold">Instructions:</h3>
              <Textarea readOnly value={recipe.instructions} className="min-h-[100px] resize-none" />
            </div>
            <Button
              onClick={handleAddToFavorites}
              className={`btn ${isFavorite ? 'bg-destructive text-destructive-foreground hover:bg-destructive/80' : 'bg-accent text-accent-foreground hover:bg-accent/80'}`}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </CardContent>
        </Card>
      )}

      {favoriteRecipes.length > 0 && (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Favorite Recipes</CardTitle>
            <CardDescription>Your saved favorite recipes:</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {favoriteRecipes.map((favRecipe, index) => (
              <div key={index} className="card p-4">
                <h3 className="text-xl font-semibold">{favRecipe.recipeName}</h3>
                <p>Ingredients: {favRecipe.ingredients.join(', ')}</p>
                <p className="text-sm">Instructions: {favRecipe.instructions.substring(0, 100)}...</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
