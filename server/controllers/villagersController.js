// import { from } from "nodemailer/lib/mime-node/le-windows.js";
import VillagerModel from "../model/Vllager.model.js";
import UserModel from "../model/User.model.js";

export async function addVillager(req, res) {
  try {
    const { address, gsDivision, divisionNumber, houseHoldNo, members,houseHolderNIC } =
      req.body;

    // check for existing details
    let error = {};
    // let i = 0;
    // while (members[i]) {
    //     const existNIC = await VillagerModel.find({ "members.nic": "123456" } );
    //     const existContact = await VillagerModel.findOne({ contact: members[i].contact });

    //     if (existNIC) {
    //         return res.status(500).send({ nic: members[i].nic });
    //         error.nic = [i, "Please use unique NIC"];
    //     }
    //     if (existContact) {
    //         error.contact = [i, "Please use unique Contact Number"];
    //     }
    //     i++;
    // }

    if (!(Object.keys(error).length === 0 && error.constructor === Object)) {
      return res.status(500).send({ error });
    } else {
      try {
        const user = new VillagerModel({
          address,
          gsDivision,
          divisionNumber,
          houseHoldNo,
          members,
          houseHolderNIC
        });

        // return save result as a response
        user
          .save()
          .then((result) =>
            res.status(201).send({ msg: "Register Successfully" })
          )
          .catch((error) => res.status(500).send({ error }));
      } catch (error) {
        return res.status(500).send(error);
      }
    }
  } catch (error) {
    return res.status(500).send({ error: "aiyooo" });
  }
}

export async function getVillagers(req, res) {
  let nic = req.params.nic;
  try {
      try {
          let users = await VillagerModel.find({
              members: {
                  $elemMatch: {
                      nic ,
                  },
              },
          });

          if (!users) {
              return res.status(501).send({ error: "Cannot find user data" });
          } else {
              let members = users[0].members;
              let i = 0;
              while (members[i]) {
                  let nicx = members[i].nic ? members[i].nic : "";
                  if (nicx === nic) {
                      return res.status(201).send(members[i]);
                  }
                  i++;
              }
              return res.status(201).send({error: "Cannot find NIC"});
          }

      } catch (error) {
          return res.status(500).send({ error: "Cannot find NIC" });
      }
  } catch (error) {
      return res.status(501).send({ error: "Cannot find user data" });
    }
}

//! uploard the image function for competition

export async function SaveCompetitionImage(req,res){
  const {userId} = req.body;

  try {
    let details = await VillagerModel.findOne({_id : userId});

    console.log(details);

    return res.status(200).send({type : "Succes" , message : details});

  } catch (error) {
    console.log(error);
  }
}

export async function getVilagerDetails(req,res){

  const {email} = req.body;

  try {
    var details = await UserModel.findOne({email});

    if(details){
      return res.status(200).send({type : "Success" , message : details});
    }else{
      return res.status(404).send({type : "Error"});
    }
  } catch (error) {
    console.log(error);
  }
}