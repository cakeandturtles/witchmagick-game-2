#! /usr/bin/env python

import os, sys
import pygame
from pygame.locals import *

if not pygame.font: print 'Warning, fonts disabled'
if not pygame.mixer: print 'Warning, sound disabled'

class Main:
	def __init__(self, width=640,height=480):
		"""Initialize"""
		pygame.init()
		
		self.width = width
		self.height = height
		self.screen = pygame.display.set_mode((self.width, self.height))
		
	def start(self):
		"""This is the Main Loop of the Game"""
		
		"""Create the background"""
		self.background = pygame.Surface(self.screen.get_size())
		self.background = self.background.convert()
		self.background.fill((0, 0, 0))
		
		pygame.display.flip()
		while 1:
			self.update()
			self.render()
			pygame.time.wait(16)
		
	def update(self):
		for event in pygame.event.get():
			if event.type == pygame.QUIT:
				sys.exit()
		
	def render(self):
		self.screen.blit(self.background, (0, 0))

	
if __name__ == "__main__":
	window = Main(640, 480)
	window.start()