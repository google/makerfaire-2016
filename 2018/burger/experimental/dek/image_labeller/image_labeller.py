import glob
import cv2
import os
import sys
import signal
from PyQt5 import QtGui, QtCore, QtWidgets, QtMultimedia, QtMultimediaWidgets

NO_STATE=0
TOP_LEFT=1
TOP_RIGHT=2
BOTTOM_RIGHT=3
BOTTOM_LEFT=4

items = 'empty', 'topbun', 'lettuce', 'tomato', 'cheese', 'patty', 'bottombun'

class QGraphicsRectItem(QtWidgets.QGraphicsRectItem):
    def __init__(self, *args, **kwargs):
        super(QGraphicsRectItem, self).__init__(*args, **kwargs)
        self.setFlags(QtWidgets.QGraphicsItem.ItemIsMovable | QtWidgets.QGraphicsItem.ItemSendsGeometryChanges)
        self.start = None
        self.state = NO_STATE
        
    def mousePressEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            if bool(event.modifiers() & QtCore.Qt.ControlModifier):
                tlw = QtWidgets.qApp.topLevelWidgets()
                for item in tlw:
                    if isinstance(item, MainWindow):
                        item.scene.removeItem(self)
                        event.accept()
                        return
            else:
                sp = event.scenePos()
                if QtGui.QVector2D(sp - self.sceneBoundingRect().topLeft()).length() < 25:
                    self.state = TOP_LEFT
                    self.start = event.scenePos()
                elif QtGui.QVector2D(sp - self.sceneBoundingRect().topRight()).length() < 25:
                    self.state = TOP_RIGHT
                    self.start = event.scenePos()
                elif QtGui.QVector2D(sp - self.sceneBoundingRect().bottomRight()).length() < 25:
                    self.state = BOTTOM_RIGHT
                    self.start = event.scenePos()
                elif QtGui.QVector2D(sp - self.sceneBoundingRect().bottomLeft()).length() < 25:
                    self.state = BOTTOM_LEFT
                    self.start = event.scenePos()
            
        super(QGraphicsRectItem, self).mousePressEvent(event)

    def mouseMoveEvent(self, event):
        if bool(event.modifiers() & QtCore.Qt.ControlModifier):
            event.ignore()
            return
        
        if (event.buttons() & QtCore.Qt.LeftButton):
            sp = event.scenePos()
            if self.state != NO_STATE:
                d = sp - self.start
                r = self.rect()
                if self.state == TOP_LEFT:
                    r.setTopLeft(sp)
                elif self.state == TOP_RIGHT:
                    r.setTopRight(sp)
                elif self.state == BOTTOM_RIGHT:
                    r.setBottomRight(sp)
                elif self.state == BOTTOM_LEFT:
                    r.setBottomLeft(sp)
                self.setRect(r)
                self.start = event.scenePos()
                event.ignore()
                return
        super(QGraphicsRectItem, self).mouseMoveEvent(event)
        
    def mouseReleaseEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            if bool(event.modifiers() & QtCore.Qt.ControlModifier):
                event.accept()
                return
            else:
                self.state = NO_STATE
        super(QGraphicsRectItem, self).mouseReleaseEvent(event)
        
class QGraphicsView(QtWidgets.QGraphicsView):
    def __init__(self, *args, **kwargs):
        super(QGraphicsView, self).__init__(*args, **kwargs)
        self.start = None

class QGraphicsScene(QtWidgets.QGraphicsScene):
    def __init__(self, *args, **kwargs):
        super(QGraphicsScene, self).__init__(*args, **kwargs)
        self.start = None
        
    def mousePressEvent(self, event):
        self.start = event.scenePos()
        super(QGraphicsScene, self).mousePressEvent(event)

    def mouseReleaseEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            if bool(event.modifiers() & QtCore.Qt.ControlModifier):
                event.accept
                return
            else:
                if not self.mouseGrabberItem():
                    end = event.scenePos()
                    if self.start:
                        tlw = QtWidgets.qApp.topLevelWidgets()
                        for item in tlw:
                            if isinstance(item, MainWindow):
                                label, okPressed = QtWidgets.QInputDialog.getItem(tlw[0], "Set label", 
                                                                 "Label:", items, 0, False)
                                if okPressed and label != '':
                                    r = QtCore.QRectF(self.start, end)
                                    self.addLabelRect(r, label)
                                    self.start = None
        super(QGraphicsScene, self).mouseReleaseEvent(event)

    def addLabelRect(self, rect, label):
        box = QGraphicsRectItem(rect)
        self.addItem(box)
        text = self.addSimpleText(label)
        text.setParentItem(box)
        text.setPos(rect.topLeft())
        
class MainWindow(QtWidgets.QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()
        self.central_widget = QtWidgets.QWidget(self)
        central_layout = QtWidgets.QVBoxLayout()
        self.central_widget.setLayout(central_layout)
        self.setCentralWidget(self.central_widget)

        self.view = QGraphicsView()
        self.view.setDragMode(QtWidgets.QGraphicsView.RubberBandDrag)
        self.scene = QGraphicsScene()
        self.view.setScene(self.scene)

        self.control_widget = QtWidgets.QWidget(self)
        self.forward_button = QtWidgets.QPushButton('forward')
        self.forward_button.clicked.connect(self.forward)
        self.backward_button = QtWidgets.QPushButton('backward')
        self.backward_button.clicked.connect(self.backward)
        self.control_layout = QtWidgets.QHBoxLayout()
        self.control_layout.addWidget(self.forward_button)
        self.control_layout.addWidget(self.backward_button)
        self.control_widget.setLayout(self.control_layout)

        central_layout.addWidget(self.view)
        central_layout.addWidget(self.control_widget)


        exitAction = QtWidgets.QAction(QtGui.QIcon('exit.png'), '&Exit', self)
        exitAction.setShortcut('Ctrl+Q')
        exitAction.setStatusTip('Exit application')
        exitAction.triggered.connect(QtWidgets.qApp.quit)
        saveLabelsAction = QtWidgets.QAction(QtGui.QIcon('saveLabels.png'), '&Save labels', self)
        saveLabelsAction.setStatusTip('SaveImage')
        saveLabelsAction.triggered.connect(self.saveLabels)

        menubar = self.menuBar()
        fileMenu = menubar.addMenu('&File')
        fileMenu.addAction(saveLabelsAction)
        fileMenu.addAction(exitAction)

        self.currentItem = None
        self.index = None
        self.video = None

        g = glob.glob("/home/dek/movie/test.*.png")
        g.sort()
        self.loadImageFrames(g)
        # r = QtCore.QRectF(QtCore.QPointF(50, 50), QtCore.QPointF(100, 100))
        # self.scene.addLabelRect(r, "test")
        # self.saveLabels()


    def forward(self, event):
        if self.index is not None:
            if self.index <= len(self.filenames):
                self.index = self.index + 1
                self.readImageFrame()
        elif self.video:
            max_ = self.video.get(cv2.CAP_PROP_FRAME_COUNT)
            pos = self.video.get(cv2.CAP_PROP_POS_FRAMES)
            if pos < max_:
                self.readMovieFrame()
        
    def backward(self, event):
        if self.index is not None:
            print self.index
            if self.index > 0:
                self.index = self.index - 1
                self.readImageFrame()
        elif self.video:
            pos = self.video.get(cv2.CAP_PROP_POS_FRAMES)
            if pos > 0:
                self.video.set(cv2.CAP_PROP_POS_FRAMES, pos-2)
                self.readFrame()

    def loadImageFrames(self, filenames=None):
        if not filenames:
            filenames = QtWidgets.QFileDialog.getOpenFileName(self, 'Open Files')[0]
        self.filenames = filenames
        self.index = 0
        self.readImageFrame()

    def readImageFrame(self):
        filename = self.filenames[self.index]
        print "read", filename
        image = QtGui.QImage(filename, 'ARGB32')
        pixmap = QtGui.QPixmap(image)
        if self.currentItem != None:
            self.currentItem.setPixmap(pixmap)
        else:
            self.currentItem = self.scene.addPixmap(pixmap)
        self.currentItem.filename = filename
        
    def saveLabels(self):
        if self.currentItem:
            filename = self.currentItem.filename
            if self.video:
                labels_filename = os.path.join("labels", os.path.basename(filename) + ".labels." + str(int(self.video.get(cv2.CAP_PROP_POS_FRAMES)-1)))
            else:
                labels_filename = os.path.join("labels", os.path.basename(filename) + ".labels")
            with open(labels_filename, "w") as f:
                for item in self.scene.items():
                    if isinstance(item, QGraphicsRectItem):
                        c = list(item.rect().getCoords())
                        label = item.childItems()[0].text()
                        f.write("%f %f %f %f %s\n" % (c[0], c[1], c[2], c[3], label))

if __name__ == '__main__':
    signal.signal(signal.SIGINT, signal.SIG_DFL)
    app = QtWidgets.QApplication(sys.argv)
    widget = MainWindow()
    widget.show()
    app.exec_()
