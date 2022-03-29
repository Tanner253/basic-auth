'use strict';

class ICollection{
  constructor(model){
    this.model = model;
  }

  async create(json){
    try{
      let instance = await this.model.create(json);
      return instance;
    }
    catch(e){
      console.error(e);
      return e;
    }
  }

  async read(){
    try{
      let results = await this.model.findAll();
      return results;
    }catch(e){
      console.error(e);
      return e;
    }
  }

  async read(id, options){
    try{
      const objId = parseInt(id);
      let query = {where : {id : objId }, ...options};

      let results = await this.model.findOne(query);
      return results;
    }catch(e){
      console.error(e);
      return e;
    }
  }

  async update(id, obj){
    try{
      const objId = parseInt(id);
      let person = await this.model.findOne({
        where:{ id: objId }
      })
      let updatedPerson = await person.update(obj);
      return updatedPerson;
    }catch(e){
      console.error(e);
    }
  }

  async delete(id){
    try{
      const objId = parseInt(id);
      let query = { where: { id: objId }}
      let instanceToRemove = await this.model.findOne(query);
      await this.model.destroy(query);
      return instanceToRemove;
    }catch(e){
      console.error(e);
    }
  }
}

module.exports = ICollection;