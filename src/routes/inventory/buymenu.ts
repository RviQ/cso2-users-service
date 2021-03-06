import express from 'express'
import { MongoError } from 'mongodb'

import { LogInstance } from 'log/loginstance'

import { InventoryBuyMenu } from 'entities/inventory/buymenu'

/**
 * handles requests to /inventory/:userId/buymenu
 */
export class InventoryBuyMenuRoute {
  constructor(app: express.Express) {
    app.route('/inventory/:userId/buymenu')
      .get(this.onGetInventoryBuyMenu)
      .post(this.onPostInventoryBuyMenu)
      .put(this.onPutInventoryBuyMenu)
      .delete(this.onDeleteInventoryBuyMenu)
  }

  /**
   * called when a GET request to /inventory/:userId/buymenu is done
   * gets an user's buy menu
   * returns 200 if successful
   * returns 400 if the request is malformed
   * returns 404 if the user doesn't exist
   * returns 500 if an internal unknown error occured
   * @param req the request data
   * @param res the response data
   * @param next the next request handler
   */
  private async onGetInventoryBuyMenu(req: express.Request, res: express.Response): Promise<void> {
    const reqUserId: number = Number(req.params.userId)

    LogInstance.debug(`GET request to /inventory/${reqUserId}/buymenu`)

    // return bad request if the userid is invalid
    if (isNaN(reqUserId)) {
      return res.status(400).end()
    }

    try {
      const buyMenu: InventoryBuyMenu = await InventoryBuyMenu.get(req.body, reqUserId)
      if (buyMenu !== null) {
        return res.status(200).json(buyMenu).end()
      } else {
        return res.status(404).end()
      }
    } catch (error) {
      LogInstance.error(error)
      return res.status(500).end()
    }
  }

  /**
   * called when a POST request to /inventory/:userId/buymenu is done
   * creates a buy menu for an user
   * returns 201 if created successfully
   * returns 400 if the request is malformed
   * returns 409 if the user already has a buy menu
   * returns 500 if an internal unknown error occured
   * @param req the request data
   * @param res the response data
   * @param next the next request handler
   */
  private async onPostInventoryBuyMenu(req: express.Request, res: express.Response): Promise<void> {
    const reqUserId: number = Number(req.params.userId)

    LogInstance.debug(`POST request to /inventory/${reqUserId}/buymenu`)

    if (isNaN(reqUserId)) {
      return res.status(400).end()
    }

    try {
      const newBuyMenu: InventoryBuyMenu = await InventoryBuyMenu.create(reqUserId)
      return res.status(201).json(newBuyMenu).end()
    } catch (error) {
      if (error instanceof MongoError) {
        // 11000 is the duplicate key error code
        if (error.code === 11000) {
          LogInstance.warn(`Tried to create a buy menu for an existing user (userId: ${reqUserId}`)
          return res.status(409).end()
        }
      }
      LogInstance.error(error)
      return res.status(500).end()
    }
  }

  /**
   * called when a PUT request to /inventory/:userId/buymenu is done
   * sets an user's sub buy menu
   * returns 200 if set successfully
   * returns 400 if the request is malformed
   * returns 404 if the user doesn't exist
   * returns 500 if an internal unknown error occured
   * @param req the request data
   * @param res the response data
   * @param next the next request handler
   */
  private async onPutInventoryBuyMenu(req: express.Request, res: express.Response): Promise<void> {
    const reqUserId: number = Number(req.params.userId)

    LogInstance.debug(`PUT request to /inventory/${reqUserId}/buymenu`)

    // return bad request if the userid or the body are invalid
    if (isNaN(reqUserId)) {
      return res.status(400).end()
    }

    try {
      const wasUpdated: boolean = await InventoryBuyMenu.set(req.body, reqUserId)
      if (wasUpdated === true) {
        return res.status(200).end()
      } else {
        return res.status(404).end()
      }
    } catch (error) {
      LogInstance.error(error)
      return res.status(500).end()
    }
  }

  /**
   * called when a DELETE request to /inventory/:userId/buymenu is done
   * deletes an user's buy menu
   * returns 200 if deleted successfully
   * returns 400 if the request is malformed
   * returns 404 if the user doesn't exist
   * returns 500 if an internal unknown error occured
   * @param req the request data
   * @param res the response data
   * @param next the next request handler
   */
  private async onDeleteInventoryBuyMenu(req: express.Request, res: express.Response): Promise<void> {
    const reqUserId: number = Number(req.params.userId)

    LogInstance.debug(`DELETE request to /inventory/${reqUserId}/buymenu`)

    if (isNaN(reqUserId)) {
      return res.status(400).end()
    }

    try {
      const wasDeleted: boolean = await InventoryBuyMenu.remove(reqUserId)
      if (wasDeleted === true) {
        return res.status(200).end()
      } else {
        return res.status(404).end()
      }
    } catch (error) {
      LogInstance.error(error)
      return res.status(500).end()
    }
  }
}
