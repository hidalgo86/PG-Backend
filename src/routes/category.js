const express = require("express");

const route = express.Router();

const { Product, Category } = require("../db.js");
const { Sequelize, Op } = require("sequelize");

// GET por nombre y todas. 

route.get("/", async (req, res) => {
  const { name } = req.query;
 console.log(name)
  try {
    if (name) {
      const categoryName = await Category.findOne({
        where: {
          name: {
            [Op.like]: name,
          },
        },
      });
      return categoryName
        ? res.status(200).send(categoryName)
        : res.status(404).send("Category Not Found");
    } else {
      const allCategories = await Category.findAll();

      return allCategories.length
      ? res.status(200).send(allCategories)
      : res.status(404).send("No Categories on DataBase");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
  
//POST: agregar una categoría.  faltaria validar que solo pueda hacerlo un admin
route.post("/", async (req, res) => {
  const {
    name,
  } = req.body;
  if (!name) {
    return res.status(400).send("Some data is missing");
  }
  try {
    let [categorySaved, created] = await Category.findOrCreate({
      where: { name: name },
    });
    return !created
      ? res.status(404).send(`${name} already exist`)
      : res.status(200).json(categorySaved);
  } catch (err) {
    console.log(err.message);
    res.status(404).json(err.message);
  }
});

route.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
      const deletedCategory = await Category.destroy({
          where:{
              id
          }
      });
      return res.json(deletedCategory)
  } catch(error){
      console.log(error)
  }      
});

route.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name
  } = req.body;
  console.log(name)

  // if (!id){ return res.status(404).send("Product id is required")}

  try {
    const category_Id = await Category.update({
      name
    },
    {where: {
      id: id
    }});
    res.status(200).send(`${category_Id} category has been modify`);
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});
module.exports = route